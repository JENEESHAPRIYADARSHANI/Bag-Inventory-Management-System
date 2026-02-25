import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "ORD-001",
    customer: "Tech Solutions Ltd",
    products: "Executive Laptop Bag x100",
    totalAmount: "$12,500",
    status: "completed",
    paymentStatus: "paid",
    orderDate: "Jan 15, 2026",
    deliveryDate: "Jan 22, 2026",
  },
  {
    id: "ORD-002",
    customer: "Global Corp Inc",
    products: "Corporate Messenger x75",
    totalAmount: "$8,750",
    status: "processing",
    paymentStatus: "pending",
    orderDate: "Jan 14, 2026",
    deliveryDate: "Jan 25, 2026",
  },
  {
    id: "ORD-003",
    customer: "Innovate Hub",
    products: "Premium Backpack Pro x120",
    totalAmount: "$15,200",
    status: "pending",
    paymentStatus: "pending",
    orderDate: "Jan 13, 2026",
    deliveryDate: "Feb 01, 2026",
  },
  {
    id: "ORD-004",
    customer: "Digital Wave Co",
    products: "Business Travel Set x50",
    totalAmount: "$6,800",
    status: "completed",
    paymentStatus: "paid",
    orderDate: "Jan 12, 2026",
    deliveryDate: "Jan 19, 2026",
  },
  {
    id: "ORD-005",
    customer: "NextGen Enterprises",
    products: "Elite Briefcase x200",
    totalAmount: "$22,100",
    status: "processing",
    paymentStatus: "partial",
    orderDate: "Jan 11, 2026",
    deliveryDate: "Jan 30, 2026",
  },
  {
    id: "ORD-006",
    customer: "Prime Industries",
    products: "Executive Laptop Bag x150",
    totalAmount: "$18,750",
    status: "shipped",
    paymentStatus: "paid",
    orderDate: "Jan 10, 2026",
    deliveryDate: "Jan 18, 2026",
  },
];

const statusStyles = {
  completed: "bg-success/10 text-success border-success/20",
  processing: "bg-info/10 text-info border-info/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  shipped: "bg-primary/10 text-primary border-primary/20",
};

const paymentStyles = {
  paid: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  partial: "bg-info/10 text-info border-info/20",
};

const Orders = () => {
  return (
    <DashboardLayout
      title="Orders"
      subtitle="Manage and track all corporate orders"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-10 bg-muted/50 border-transparent focus:border-primary"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                    Order ID
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Delivery
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-primary">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">
                    {order.products}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {order.totalAmount}
                  </td>
                  <td className="px-6 py-4">
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
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize font-medium",
                        paymentStyles[order.paymentStatus as keyof typeof paymentStyles]
                      )}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {order.deliveryDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
