import { useState, useEffect } from "react";
import { InventoryItem, getStockStatus } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Package,
  Save,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Calendar,
  Hash,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusDisplay = {
  in_stock: { label: "In Stock", icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
  low_stock: { label: "Low Stock", icon: AlertTriangle, className: "bg-warning/10 text-warning border-warning/20" },
  out_of_stock: { label: "Out of Stock", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

interface InventoryDetailDialogProps {
  item: InventoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: { quantityInStock?: number; reorderLevel?: number }) => void;
  onIncrease: (id: string, amount: number) => void;
  onReduce: (id: string, amount: number) => void;
}

export function InventoryDetailDialog({
  item,
  open,
  onOpenChange,
  onUpdate,
  onIncrease,
  onReduce,
}: InventoryDetailDialogProps) {
  const [editQty, setEditQty] = useState(0);
  const [editReorder, setEditReorder] = useState(0);
  const [adjustAmount, setAdjustAmount] = useState("");

  useEffect(() => {
    if (item) {
      setEditQty(item.quantityInStock);
      setEditReorder(item.reorderLevel);
      setAdjustAmount("");
    }
  }, [item]);

  if (!item) return null;

  const currentStatus = getStockStatus({ ...item, quantityInStock: editQty, reorderLevel: editReorder });
  const config = statusDisplay[currentStatus];
  const StatusIcon = config.icon;

  const handleUpdateStock = () => {
    onUpdate(item.id, { quantityInStock: editQty, reorderLevel: editReorder });
    toast.success("Inventory updated successfully");
    onOpenChange(false);
  };

  const handleIncrease = () => {
    const amt = parseInt(adjustAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid positive number");
      return;
    }
    onIncrease(item.id, amt);
    setEditQty((prev) => prev + amt);
    setAdjustAmount("");
    toast.success(`Added ${amt} units to stock`);
  };

  const handleReduce = () => {
    const amt = parseInt(adjustAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Enter a valid positive number");
      return;
    }
    if (amt > editQty) {
      toast.error("Cannot reduce below zero");
      return;
    }
    onReduce(item.id, amt);
    setEditQty((prev) => Math.max(0, prev - amt));
    setAdjustAmount("");
    toast.success(`Removed ${amt} units from stock`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Inventory Detail
          </DialogTitle>
          <DialogDescription>
            View and manage stock for this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info Card */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg text-foreground">{item.productName}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <Badge variant="outline" className={cn("font-medium gap-1", config.className)}>
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                <span>ID: {item.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Layers className="h-3.5 w-3.5" />
                <span>SKU: {item.productId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-qty">Quantity in Stock</Label>
              <Input
                id="edit-qty"
                type="number"
                min={0}
                value={editQty}
                onChange={(e) => setEditQty(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reorder">Reorder Level</Label>
              <Input
                id="edit-reorder"
                type="number"
                min={0}
                value={editReorder}
                onChange={(e) => setEditReorder(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Quick Stock Adjustment */}
          <div className="space-y-3">
            <Label>Quick Stock Adjustment</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                placeholder="Amount..."
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                className="gap-1 text-success border-success/30 hover:bg-success/10"
                onClick={handleIncrease}
              >
                <Plus className="h-4 w-4" />
                Increase
              </Button>
              <Button
                variant="outline"
                className="gap-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={handleReduce}
              >
                <Minus className="h-4 w-4" />
                Reduce
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Quickly add or remove units without changing the main quantity field.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="btn-gradient gap-1" onClick={handleUpdateStock}>
            <Save className="h-4 w-4" />
            Update Stock
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
