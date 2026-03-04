import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Filter, ArrowUpDown, Package, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import * as quotationApi from "@/services/quotationApi";
import { toast } from "sonner";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface Order {
  id: number;
  quotationId: number;
  customerId: string;
  email: string;
  companyName: string;
  contactPerson: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

const statusStyles: Record<string, string> = {
  CONFIRMED: "bg-success/10 text-success border-success/20",
  PROCESSING: "bg-info/10 text-info border-info/20",
  PENDING: "bg-warning/10 text-warning border-warning/20",
  SHIPPED: "bg-primary/10 text-primary border-primary/20",
  COMPLETED: "bg-success/10 text-success border-success/20",
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await quotationApi.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(searchTerm) ||
      order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Orders"
      subtitle="Manage and track all orders converted from quotations"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-10 bg-muted/50 border-transparent focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={loadOrders} title="Refresh">
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="border-border">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && filteredOrders.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm
                ? "No orders match your search"
                : "Orders will appear here when quotations are converted"}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Orders Table */}
      {!loading && filteredOrders.length > 0 && (
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
                    Quotation ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-primary">
                      ORD-{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      QT-{order.quotationId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {order.companyName}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {order.contactPerson}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {order.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize font-medium",
                          statusStyles[order.status] || "bg-muted/10 text-muted-foreground border-muted/20"
                        )}
                      >
                        {order.status.toLowerCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      {!loading && filteredOrders.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredOrders.length} order(s)
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Orders;
