import { UserLayout } from "@/components/layout/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTracking } from "@/contexts/TrackingContext";
import { useAuth } from "@/contexts/AuthContext";
import { DELIVERY_STATUS_LABELS, DeliveryStatus, DELIVERY_STATUS_ORDER } from "@/types/tracking";
import { Package, Truck, CheckCircle, XCircle, Clock, MapPin, RefreshCw, Ban, Search } from "lucide-react";
import { useState } from "react";

const statusColors: Record<DeliveryStatus, string> = {
  order_confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processing: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  packed: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  out_for_delivery: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border-border",
};

const statusIcons: Record<DeliveryStatus, typeof Package> = {
  order_confirmed: Package,
  processing: RefreshCw,
  packed: Package,
  shipped: Truck,
  out_for_delivery: MapPin,
  delivered: CheckCircle,
  failed: XCircle,
  cancelled: Ban,
};

const UserTracking = () => {
  const { records } = useTracking();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // In a real app, filter by customer. For now show all.
  const myRecords = records.filter(
    (r) =>
      r.orderId.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  // Progress bar helper
  const getProgress = (status: DeliveryStatus) => {
    if (status === "cancelled" || status === "failed") return 0;
    const idx = DELIVERY_STATUS_ORDER.indexOf(status);
    return idx >= 0 ? Math.round(((idx + 1) / DELIVERY_STATUS_ORDER.length) * 100) : 0;
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">My Deliveries</h1>
          <p className="text-muted-foreground">Track the status of your orders</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by Order ID or Tracking ID..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {myRecords.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No deliveries found</h3>
              <p className="text-sm text-muted-foreground">Tracking info will appear here once your orders are confirmed.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {myRecords.map((r) => {
              const StatusIcon = statusIcons[r.currentStatus];
              const progress = getProgress(r.currentStatus);
              return (
                <Card key={r.id} className="border-border/50 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <CardTitle className="text-base">{r.orderId}</CardTitle>
                        <p className="text-sm text-muted-foreground">Tracking: {r.id}</p>
                      </div>
                      <Badge variant="outline" className={statusColors[r.currentStatus]}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {DELIVERY_STATUS_LABELS[r.currentStatus]}
                      </Badge>
                    </div>
                    {/* Progress bar */}
                    {!["cancelled", "failed"].includes(r.currentStatus) && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Order Confirmed</span>
                          <span>Delivered</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Est. Delivery</p>
                        <p className="font-medium">{formatDate(r.estimatedDeliveryDate)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Updated</p>
                        <p className="font-medium">{formatDateTime(r.lastUpdated)}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <p className="text-sm font-medium mb-3">Status Updates</p>
                    <div className="relative pl-6 space-y-3">
                      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
                      {r.statusHistory.map((entry, idx) => {
                        const Icon = statusIcons[entry.status] || Package;
                        const isLast = idx === r.statusHistory.length - 1;
                        return (
                          <div key={entry.id} className="relative flex gap-3">
                            <div className={`absolute -left-4 top-1 h-4 w-4 rounded-full flex items-center justify-center ${isLast ? "bg-primary" : "bg-muted"}`}>
                              <Icon className={`h-2.5 w-2.5 ${isLast ? "text-primary-foreground" : "text-muted-foreground"}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">{DELIVERY_STATUS_LABELS[entry.status]}</p>
                                <span className="text-xs text-muted-foreground">{formatDateTime(entry.updatedAt)}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{entry.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UserTracking;
