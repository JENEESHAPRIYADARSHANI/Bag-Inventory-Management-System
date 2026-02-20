import { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const AVAILABLE_PRODUCTS = [
  { id: "1", name: "Executive Leather Briefcase", category: "Briefcases" },
  { id: "2", name: "Urban Travel Backpack", category: "Backpacks" },
  { id: "3", name: "Classic Tote Bag", category: "Totes" },
  { id: "4", name: "Vintage Messenger Bag", category: "Messenger" },
  { id: "5", name: "Weekend Duffle Bag", category: "Duffle" },
  { id: "6", name: "Minimalist Laptop Sleeve", category: "Accessories" },
  { id: "7", name: "Premium Leather Wallet", category: "Accessories" },
  { id: "8", name: "Canvas Travel Bag", category: "Duffle" },
  { id: "9", name: "Compact Crossbody Bag", category: "Messenger" },
];

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: { productId: string; productName: string; category: string; quantityInStock: number; reorderLevel: number }) => void;
  existingProductIds: string[];
}

export function AddInventoryDialog({ open, onOpenChange, onAdd, existingProductIds }: AddInventoryDialogProps) {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");

  const availableToAdd = AVAILABLE_PRODUCTS.filter(
    (p) => !existingProductIds.includes(p.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const product = AVAILABLE_PRODUCTS.find((p) => p.id === selectedProduct);
    if (!product) {
      toast.error("Please select a product");
      return;
    }

    const qty = parseInt(quantity);
    const reorder = parseInt(reorderLevel);

    if (isNaN(qty) || qty < 0) {
      toast.error("Please enter a valid stock quantity");
      return;
    }
    if (isNaN(reorder) || reorder < 0) {
      toast.error("Please enter a valid reorder level");
      return;
    }

    onAdd({
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantityInStock: qty,
      reorderLevel: reorder,
    });

    // Reset form
    setSelectedProduct("");
    setQuantity("");
    setReorderLevel("");
    onOpenChange(false);
    toast.success(`Inventory for "${product.name}" created`);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedProduct("");
      setQuantity("");
      setReorderLevel("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Add Inventory
          </DialogTitle>
          <DialogDescription>
            Create a new inventory record for a product.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    All products already added
                  </SelectItem>
                ) : (
                  availableToAdd.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} ({product.category})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Initial Stock Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              placeholder="e.g. 100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reorderLevel">Reorder Level</Label>
            <Input
              id="reorderLevel"
              type="number"
              min={0}
              placeholder="e.g. 25"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              You'll be alerted when stock falls below this level.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient">
              Create Inventory
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
