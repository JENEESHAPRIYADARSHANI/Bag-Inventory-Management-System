import { useEffect, useState } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import {
  fetchOrdersForCustomer,
  requestCancel,
  type OrderDto,
  type OrderStatus,
} from "@/services/orderApi";

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

function canCancelByStatus(status?: OrderStatus) {
  return status === "PENDING" || status === "CONFIRMED";
}

function isWithinTwoDays(orderDate?: string) {
  if (!orderDate) return false;

  const createdAt = new Date(orderDate);
  if (Number.isNaN(createdAt.getTime())) return false;

  const now = new Date();
  const diffMs = now.getTime() - createdAt.getTime();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;

  return diffMs <= twoDaysMs;
}

function getRemainingCancelTime(orderDate?: string) {
  if (!orderDate) return null;

  const createdAt = new Date(orderDate);
  if (Number.isNaN(createdAt.getTime())) return null;

  const now = new Date();
  const twoDaysMs = 2 * 24 * 60 * 60 * 1000;
  const remainingMs = twoDaysMs - (now.getTime() - createdAt.getTime());

  if (remainingMs <= 0) return null;

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return `${hours}h ${minutes}m left to cancel`;
  return `${minutes}m left to cancel`;
}

const UserOrders = () => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const customerId = Number(user?.id);
      if (!customerId || Number.isNaN(customerId)) {
        throw new Error("Invalid customer id. Please login again.");
      }

      const data = await fetchOrdersForCustomer(customerId);
      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setOrders([]);
      setError(e?.message ?? "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (order: OrderDto) => {
    if (!order.id) return;

    const status = order.status ?? "PENDING";

    if (!canCancelByStatus(status)) {
      setError("This order cannot be cancelled in its current status.");
      return;
    }

    if (!isWithinTwoDays(order.orderDate)) {
      setError("You can only cancel an order within 2 days of placing it.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${order.id}?`
    );

    if (!confirmed) return;

    try {
      setError(null);
      setActionLoadingId(order.id);
      await requestCancel(order.id);
      await loadOrders();
    } catch (e: any) {
      setError(e?.message ?? "Failed to cancel order");
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user?.id]);

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              My Orders
            </h1>
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
            <CardContent className="py-8 text-muted-foreground">
              Loading orders...
            </CardContent>
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
                const key =
                  order.id != null ? String(order.id) : `user-order-${index}`;

                const canCancel =
                  canCancelByStatus(status) && isWithinTwoDays(order.orderDate);

                const cancelWindowExpired =
                  canCancelByStatus(status) && !isWithinTwoDays(order.orderDate);

                const remainingTime = getRemainingCancelTime(order.orderDate);

                return (
                  <Card key={key} className="border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.id ?? "-"}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>

                        <Badge
                          variant="outline"
                          className={statusColorMap[status] || ""}
                        >
                          <Icon className="h-3 w-3 mr-1" />
                          {status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <div className="text-muted-foreground">Products</div>
                        <div className="font-medium text-foreground">
                          {order.productIds || "-"}
                        </div>
                      </div>

                      <div className="text-sm">
                        <div className="text-muted-foreground">Quantities</div>
                        <div className="font-medium text-foreground">
                          {order.quantities || "-"}
                        </div>
                      </div>

                      {remainingTime &&
                        (status === "PENDING" || status === "CONFIRMED") && (
                          <div className="text-sm text-muted-foreground">
                            {remainingTime}
                          </div>
                        )}

                      {canCancel && order.id != null && (
                        <div className="pt-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelRequest(order)}
                            disabled={actionLoadingId === order.id}
                          >
                            {actionLoadingId === order.id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </Button>
                        </div>
                      )}

                      {cancelWindowExpired && (
                        <div className="pt-2 text-sm text-red-600 font-medium">
                          Cancellation period expired. Orders can only be cancelled
                          within 2 days.
                        </div>
                      )}

                      {status === "CANCEL_REQUESTED" && (
                        <div className="pt-2 text-sm text-yellow-600 font-medium">
                          Legacy cancellation status.
                        </div>
                      )}

                      {status === "CANCELLED" && (
                        <div className="pt-2 text-sm text-red-600 font-medium">
                          This order has been cancelled.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {orders.length} order(s)
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserOrders;