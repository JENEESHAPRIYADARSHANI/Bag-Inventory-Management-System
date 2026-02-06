import { useState } from "react";
import { InventoryItem, getStockStatus, StockStatus } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Eye,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusConfig: Record<StockStatus, { label: string; icon: typeof CheckCircle; className: string }> = {
  in_stock: { label: "In Stock", icon: CheckCircle, className: "bg-success/10 text-success border-success/20" },
  low_stock: { label: "Low Stock", icon: AlertTriangle, className: "bg-warning/10 text-warning border-warning/20" },
  out_of_stock: { label: "Out of Stock", icon: XCircle, className: "bg-destructive/10 text-destructive border-destructive/20" },
};

interface InventoryTableProps {
  items: InventoryItem[];
  onView: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryTable({ items, onView, onDelete }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<InventoryItem | null>(null);

  const filtered = items.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      {/* Search */}
      <div className="relative w-full max-w-sm mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or ID..."
          className="pl-10 bg-muted/50 border-transparent focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/50">
              <TableHead className="text-muted-foreground font-semibold">Product Name</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Product ID</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Qty in Stock</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Reorder Level</TableHead>
              <TableHead className="text-muted-foreground font-semibold">Stock Status</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="font-medium">No inventory records found</p>
                  <p className="text-sm mt-1">Try adjusting your search or add a new item.</p>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((item, index) => {
                const status = getStockStatus(item);
                const config = statusConfig[status];
                const StatusIcon = config.icon;

                return (
                  <TableRow
                    key={item.id}
                    className="border-border hover:bg-muted/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{item.productId}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        "font-semibold text-lg",
                        status === "out_of_stock" && "text-destructive",
                        status === "low_stock" && "text-warning",
                        status === "in_stock" && "text-foreground"
                      )}>
                        {item.quantityInStock}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{item.reorderLevel}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("font-medium gap-1", config.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => onView(item)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                          onClick={() => onView(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inventory Record</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the inventory record for{" "}
              <span className="font-semibold text-foreground">{deleteTarget?.productName}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
