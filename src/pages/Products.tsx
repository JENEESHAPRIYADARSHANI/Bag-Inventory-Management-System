import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Package, DollarSign, Layers } from "lucide-react";

const products = [
  {
    id: "PRD-001",
    name: "Executive Laptop Bag",
    description: "Premium leather laptop bag with padded compartments",
    category: "Laptop Bags",
    price: "$125.00",
    stock: 245,
    status: "in-stock",
  },
  {
    id: "PRD-002",
    name: "Corporate Messenger",
    description: "Professional messenger bag for corporate use",
    category: "Messenger Bags",
    price: "$89.00",
    stock: 198,
    status: "in-stock",
  },
  {
    id: "PRD-003",
    name: "Premium Backpack Pro",
    description: "Ergonomic backpack with multiple compartments",
    category: "Backpacks",
    price: "$110.00",
    stock: 156,
    status: "in-stock",
  },
  {
    id: "PRD-004",
    name: "Business Travel Set",
    description: "Complete travel set with luggage and accessories",
    category: "Travel Sets",
    price: "$299.00",
    stock: 45,
    status: "low-stock",
  },
  {
    id: "PRD-005",
    name: "Elite Briefcase",
    description: "Classic leather briefcase for executives",
    category: "Briefcases",
    price: "$175.00",
    stock: 112,
    status: "in-stock",
  },
  {
    id: "PRD-006",
    name: "Compact Document Bag",
    description: "Slim document carrier for daily use",
    category: "Document Bags",
    price: "$65.00",
    stock: 8,
    status: "low-stock",
  },
];

const Products = () => {
  return (
    <DashboardLayout
      title="Products"
      subtitle="Manage your bag products and catalog"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10 bg-muted/50 border-transparent focus:border-primary"
          />
        </div>
        <Button className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Product Image Placeholder */}
            <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
              <Package className="h-16 w-16 text-primary/40" />
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">{product.name}</h3>
                  <p className="text-xs text-muted-foreground">{product.id}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    product.status === "in-stock"
                      ? "bg-success/10 text-success border-success/20"
                      : "bg-warning/10 text-warning border-warning/20"
                  }
                >
                  {product.status === "in-stock" ? "In Stock" : "Low Stock"}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="text-xs">
                  <Layers className="h-3 w-3 mr-1" />
                  {product.category}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-lg font-bold text-primary">
                  <DollarSign className="h-4 w-4" />
                  {product.price.replace("$", "")}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{product.stock}</span> units
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Products;
