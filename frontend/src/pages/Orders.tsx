import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ArrowUpDown, RefreshCw, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  fetchOrders,
  updateOrderStatus,
  adminCancelOrder,
  type OrderDto,
  type OrderStatus,
} from "@/services/orderApi";

const statusStyles: Record<string, string> = {
  COMPLETED: "bg-success/10 text-success border-success/20",
  PROCESSING: "bg-info/10 text-info border-info/20",
  CONFIRMED: "bg-primary/10 text-primary border-primary/20",
  PENDING: "bg-warning/10 text-warning border-warning/20",
  CANCEL_REQUESTED: "bg-warning/10 text-warning border-warning/20",
  CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
};

function formatMoney(amount?: number | null) {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "-";
  return `$${amount.toFixed(2)}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

type OrderRow = OrderDto & {
  customerName?: string | null;
  totalAmount?: number | null;
  deliveryDate?: string | null;
};

const Orders = () => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState<string>("");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchOrders();
      setOrders(Array.isArray(data) ? (data as OrderRow[]) : []);
    } catch (e: any) {
      const msg = e?.message ?? "Failed to load orders";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((o) => {
      const id = o?.id != null ? String(o.id) : "";
      const status = String(o?.status ?? "").toLowerCase();
      const customerName = String(o?.customerName ?? "").toLowerCase();
      const amount = o?.totalAmount != null ? String(o.totalAmount) : "";
      const customerId = o?.customerId != null ? String(o.customerId) : "";

      return (
        id.includes(query) ||
        status.includes(query) ||
        customerName.includes(query) ||
        amount.includes(query) ||
        customerId.includes(query)
      );
    });
  }, [orders, q]);

  const handleStatusUpdate = async (
    orderId: number | undefined,
    nextStatus: "CONFIRMED" | "PROCESSING" | "COMPLETED"
  ) => {
    if (!orderId) return;

    try {
      setActionLoadingId(orderId);
      setError(null);
      await updateOrderStatus(orderId, nextStatus);
      toast.success(`Order #${orderId} updated to ${nextStatus}`);
      await loadOrders();
    } catch (e: any) {
      const msg = e?.message ?? "Failed to update order status";
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAdminCancel = async (orderId: number | undefined) => {
    if (!orderId) return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel Order #${orderId}?`
    );
    if (!confirmed) return;

    try {
      setActionLoadingId(orderId);
      setError(null);
      await adminCancelOrder(orderId);
      toast.success(`Order #${orderId} cancelled`);
      await loadOrders();
    } catch (e: any) {
      const msg = e?.message ?? "Failed to cancel order";
      setError(msg);
      toast.error(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderActions = (order: OrderRow) => {
    const status = order.status ?? "PENDING";
    const isBusy = actionLoadingId === order.id;

    if (status === "PENDING") {
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "CONFIRMED")}
            disabled={isBusy}
          >
            Confirm
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleAdminCancel(order.id)}
            disabled={isBusy}
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (status === "CONFIRMED") {
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "PROCESSING")}
            disabled={isBusy}
          >
            Start Processing
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleAdminCancel(order.id)}
            disabled={isBusy}
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (status === "PROCESSING") {
      return (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => handleStatusUpdate(order.id, "COMPLETED")}
            disabled={isBusy}
          >
            Complete
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleAdminCancel(order.id)}
            disabled={isBusy}
          >
            Cancel
          </Button>
        </div>
      );
    }

    if (status === "COMPLETED") {
      return <span className="text-sm text-muted-foreground">Completed</span>;
    }

    if (status === "CANCELLED") {
      return <span className="text-sm text-muted-foreground">Cancelled</span>;
    }

    if (status === "CANCEL_REQUESTED") {
      return <span className="text-sm text-muted-foreground">Legacy status</span>;
    }

    return <span className="text-sm text-muted-foreground">-</span>;
  };

  return (
    <DashboardLayout title="Orders" subtitle="Manage and track all corporate orders">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by Order ID, status, customer..."
              className="pl-10 bg-muted/50 border-transparent focus:border-primary"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={loadOrders}
            title="Refresh"
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </Button>
        </div>
      </div>

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

      {!loading && error && (
        <Card className="border-border">
          <CardContent className="py-8 text-red-600">{error}</CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No orders found</h3>
            <p className="text-sm text-muted-foreground">
              {q
                ? `No orders match "${q}".`
                : "Orders will appear here after customers place orders."}
            </p>
            {q && (
              <Button className="mt-4" variant="outline" onClick={() => setQ("")}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <button
                      type="button"
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      Order ID <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Order Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Delivery
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filtered.map((order, index) => {
                  const rowKey =
                    order?.id != null ? String(order.id) : `order-row-${index}`;

                  const status = (order?.status ?? "PENDING") as OrderStatus;

                  const customerDisplay =
                    order.customerName ??
                    (order.customerId != null ? `Customer #${order.customerId}` : "-");

                  const amount = order.totalAmount ?? null;
                  const deliveryDate = order.deliveryDate ?? null;

                  return (
                    <tr key={rowKey} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-primary">
                        {order?.id ?? "-"}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {customerDisplay}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        {formatMoney(amount)}
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            "capitalize font-medium",
                            statusStyles[status] ?? "bg-muted text-foreground border-border"
                          )}
                        >
                          {status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(order.orderDate)}
                      </td>

                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(deliveryDate)}
                      </td>

                      <td className="px-6 py-4">{renderActions(order)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 text-sm text-muted-foreground border-t border-border">
            Showing {filtered.length} order(s){q ? ` matching "${q}"` : ""}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Orders;