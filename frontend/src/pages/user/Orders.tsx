import { useEffect, useState } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Truck, XCircle, RefreshCw } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { fetchOrdersForCustomer, type OrderDto, type OrderStatus } from "@/services/orderApi";

const statusIconMap: Record<string, any> = {
  PENDING: Clock,
  CONFIRMED: Clock,
  PROCESSING: Truck,
  COMPLETED: CheckCircle,
  CANCEL_REQUESTED: Clock,
  CANCELLED: XCircle,
};

const statusColorMap: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  PROCESSING: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
  CANCEL_REQUESTED: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  CANCELLED: "bg-red-500/10 text-red-600 border-red-500/20",
};

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

const UserOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const customerId = Number(user?.id);
      if (!customerId || Number.isNaN(customerId)) {
        throw new Error("Invalid customer id. Please login again.");
      }

      const data = await fetchOrdersForCustomer(customerId);

      // ✅ FIX: always force array
      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setOrders([]); // ✅ avoid orders.map crash
      setError(e?.message ?? "Failed to load orders");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your orders</p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={loadOrders}
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {loading && (
          <Card className="border-border/50">
            <CardContent className="py-8 text-muted-foreground">Loading orders...</CardContent>
          </Card>
        )}

        {!loading && error && (
          <Card className="border-border/50">
            <CardContent className="py-8 text-red-600">{error}</CardContent>
          </Card>
        )}

        {!loading && !error && orders.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-sm text-muted-foreground">
                Your order history will appear here after your first purchase.
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders
              .slice()
              .reverse()
              .map((order, index) => {
                const status = (order.status ?? "PENDING") as OrderStatus;
                const Icon = statusIconMap[status] || Package;
                const key = order.id != null ? String(order.id) : `user-order-${index}`;

                return (
                  <Card key={key} className="border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id ?? "-"}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>

                        <Badge variant="outline" className={statusColorMap[status] || ""}>
                          <Icon className="h-3 w-3 mr-1" />
                          {status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <div className="text-muted-foreground">Products</div>
                        <div className="font-medium text-foreground">{order.productIds || "-"}</div>
                      </div>

                      <div className="text-sm">
                        <div className="text-muted-foreground">Quantities</div>
                        <div className="font-medium text-foreground">{order.quantities || "-"}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="text-sm text-muted-foreground">Showing {orders.length} order(s)</div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserOrders;