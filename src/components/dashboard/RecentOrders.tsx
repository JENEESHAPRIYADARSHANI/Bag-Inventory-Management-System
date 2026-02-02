import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "ORD-001",
    customer: "Tech Solutions Ltd",
    amount: "$12,500",
    status: "completed",
    date: "Jan 15, 2026",
  },
  {
    id: "ORD-002",
    customer: "Global Corp Inc",
    amount: "$8,750",
    status: "processing",
    date: "Jan 14, 2026",
  },
  {
    id: "ORD-003",
    customer: "Innovate Hub",
    amount: "$15,200",
    status: "pending",
    date: "Jan 13, 2026",
  },
  {
    id: "ORD-004",
    customer: "Digital Wave Co",
    amount: "$6,800",
    status: "completed",
    date: "Jan 12, 2026",
  },
  {
    id: "ORD-005",
    customer: "NextGen Enterprises",
    amount: "$22,100",
    status: "processing",
    date: "Jan 11, 2026",
  },
];

const statusStyles = {
  completed: "bg-success/10 text-success border-success/20",
  processing: "bg-info/10 text-info border-info/20",
  pending: "bg-warning/10 text-warning border-warning/20",
};

export function RecentOrders() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold text-foreground">Recent Orders</h2>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Order ID
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Customer
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Amount
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className="group hover:bg-muted/50 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="py-4 text-sm font-medium text-foreground">{order.id}</td>
                <td className="py-4 text-sm text-muted-foreground">{order.customer}</td>
                <td className="py-4 text-sm font-semibold text-foreground">{order.amount}</td>
                <td className="py-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize font-medium",
                      statusStyles[order.status as keyof typeof statusStyles]
                    )}
                  >
                    {order.status}
                  </Badge>
                </td>
                <td className="py-4 text-sm text-muted-foreground">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
