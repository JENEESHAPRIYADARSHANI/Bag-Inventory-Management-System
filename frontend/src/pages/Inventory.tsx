import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useInventory } from "@/contexts/InventoryContext";
import { getStockStatus, InventoryItem } from "@/types/inventory";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { AddInventoryDialog } from "@/components/inventory/AddInventoryDialog";
import { InventoryDetailDialog } from "@/components/inventory/InventoryDetailDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Package,
  AlertTriangle,
  XCircle,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Inventory = () => {
  const { items, addItem, updateItem, deleteItem, increaseStock, reduceStock } = useInventory();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const stats = {
    total: items.length,
    totalUnits: items.reduce((sum, i) => sum + i.quantityInStock, 0),
    lowStock: items.filter((i) => getStockStatus(i) === "low_stock").length,
    outOfStock: items.filter((i) => getStockStatus(i) === "out_of_stock").length,
  };

  const handleView = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleAdd = (data: {
    productId: string;
    productName: string;
    category: string;
    quantityInStock: number;
    reorderLevel: number;
  }) => {
    addItem(data);
  };

  return (
    <DashboardLayout title="Inventory" subtitle="Manage product stock levels and reorder points">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          {
            label: "Total Products",
            value: stats.total,
            icon: Package,
            color: "bg-primary/10 text-primary",
          },
          {
            label: "Total Units",
            value: stats.totalUnits.toLocaleString(),
            icon: Boxes,
            color: "bg-info/10 text-info",
          },
          {
            label: "Low Stock",
            value: stats.lowStock,
            icon: AlertTriangle,
            color: "bg-warning/10 text-warning",
          },
          {
            label: "Out of Stock",
            value: stats.outOfStock,
            icon: XCircle,
            color: "bg-destructive/10 text-destructive",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Header with Add Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground">
          Inventory Records
        </h2>
        <Button className="btn-gradient gap-2" onClick={() => setIsAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Inventory
        </Button>
      </div>

      {/* Table */}
      <InventoryTable items={items} onView={handleView} onDelete={deleteItem} />

      {/* Add Dialog */}
      <AddInventoryDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onAdd={handleAdd}
        existingProductIds={items.map((i) => i.productId)}
      />

      {/* Detail / Update Dialog */}
      <InventoryDetailDialog
        item={selectedItem}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onUpdate={updateItem}
        onIncrease={increaseStock}
        onReduce={reduceStock}
      />
    </DashboardLayout>
  );
};

export default Inventory;
