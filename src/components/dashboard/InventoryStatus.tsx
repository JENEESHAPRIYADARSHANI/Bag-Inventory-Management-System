import { AlertTriangle, CheckCircle, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const inventoryItems = [
  { name: "Leather Material", current: 450, total: 500, unit: "sq ft" },
  { name: "Nylon Fabric", current: 120, total: 800, unit: "meters" },
  { name: "Metal Zippers", current: 1200, total: 2000, unit: "pcs" },
  { name: "Premium Buckles", current: 85, total: 500, unit: "pcs" },
  { name: "Thread Spools", current: 300, total: 400, unit: "rolls" },
];

export function InventoryStatus() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Inventory Status</h2>
        <Package className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-5">
        {inventoryItems.map((item, index) => {
          const percentage = (item.current / item.total) * 100;
          const isLow = percentage < 30;
          const isCritical = percentage < 15;

          return (
            <div key={item.name} style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isCritical ? (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  ) : isLow ? (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-success" />
                  )}
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {item.current}/{item.total} {item.unit}
                </span>
              </div>
              <Progress
                value={percentage}
                className={cn(
                  "h-2",
                  isCritical && "[&>div]:bg-destructive",
                  isLow && !isCritical && "[&>div]:bg-warning",
                  !isLow && "[&>div]:bg-success"
                )}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
