import { TrendingUp } from "lucide-react";

const products = [
  { name: "Executive Laptop Bag", sales: 245, revenue: "$24,500", growth: "+12%" },
  { name: "Corporate Messenger", sales: 198, revenue: "$17,820", growth: "+8%" },
  { name: "Premium Backpack Pro", sales: 156, revenue: "$14,040", growth: "+15%" },
  { name: "Business Travel Set", sales: 134, revenue: "$20,100", growth: "+5%" },
  { name: "Elite Briefcase", sales: 112, revenue: "$11,200", growth: "+10%" },
];

export function TopProducts() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Top Products</h2>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.name}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                #{index + 1}
              </div>
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{product.revenue}</p>
              <p className="flex items-center justify-end gap-1 text-sm text-success">
                <TrendingUp className="h-3 w-3" />
                {product.growth}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
