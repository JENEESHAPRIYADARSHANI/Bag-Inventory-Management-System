import { useEffect, useState } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Truck, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

const statusIcons: Record<string, typeof Package> = {
  CONFIRMED: CheckCircle,
  PROCESSING: Clock,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  Processing: Clock,
  Shipped: Truck,
  Delivered: CheckCircle,
};

const statusColors: Record<string, string> = {
  CONFIRMED: "bg-success/10 text-success border-success/20",
  PROCESSING: "bg-info/10 text-info border-info/20",
  SHIPPED: "bg-primary/10 text-primary border-primary/20",
  DELIVERED: "bg-success/10 text-success border-success/20",
  Processing: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Delivered: "bg-green-500/10 text-green-600 border-green-500/20",
};

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await quotationApi.getOrdersByEmail(user.email);
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");

      const stored = localStorage.getItem("starbags_orders");
      if (stored) {
        const localOrders = JSON.parse(stored);
        const userOrders = localOrders.filter((order: any) =>
          order.email === user.email || order.userId === user.id
        );
        setOrders(userOrders.reverse());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

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
            <CardContent className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Loading your orders...</p>
            </CardContent>
          </Card>
        )}

        {!loading && orders.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No orders yet</h3>
              <p className="text-sm text-muted-foreground">
                Your order history will appear here after quotations are converted to orders.
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusIcons[order.status] || Package;
              return (
                <Card key={order.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          From Quotation: QT-{order.quotationId}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.companyName}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          statusColors[order.status] ||
                          "bg-muted/10 text-muted-foreground border-muted/20"
                        }
                      >
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                Product ID: {item.productId}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                                {item.discount > 0 && ` (Discount: $${item.discount.toFixed(2)})`}
                              </p>
                            </div>
                            <span className="font-medium">
                              ${((item.unitPrice * item.quantity) - item.discount).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No items</p>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-primary">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {orders.length} order(s)
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserOrders;