import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTracking } from "@/contexts/TrackingContext";
import { DeliveryStatus, DELIVERY_STATUS_LABELS, DELIVERY_STATUS_ORDER, TrackingRecord } from "@/types/tracking";
import {
  Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin, CalendarDays,
  Eye, RefreshCw, Ban, Plus, MessageSquare, Filter,
} from "lucide-react";

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

const Tracking = () => {
  const { records, updateStatus, cancelDelivery, addRecord } = useTracking();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRecord, setSelectedRecord] = useState<TrackingRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<DeliveryStatus>("processing");
  const [statusMessage, setStatusMessage] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [newRecord, setNewRecord] = useState({ orderId: "", customerName: "", deliveryAddress: "", estimatedDeliveryDate: "", remarks: "" });

  // History tab filters
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState<string>("all");

  const filtered = records.filter((r) => {
    const matchesSearch = r.orderId.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const historyFiltered = records.filter((r) => {
    const matchesSearch = r.orderId.toLowerCase().includes(historySearch.toLowerCase()) ||
      r.customerName.toLowerCase().includes(historySearch.toLowerCase()) ||
      r.id.toLowerCase().includes(historySearch.toLowerCase());
    const matchesStatus = historyStatusFilter === "all" || r.currentStatus === historyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: records.length,
    inTransit: records.filter((r) => ["shipped", "out_for_delivery"].includes(r.currentStatus)).length,
    delivered: records.filter((r) => r.currentStatus === "delivered").length,
    pending: records.filter((r) => ["order_confirmed", "processing", "packed"].includes(r.currentStatus)).length,
  };

  const handleUpdateStatus = () => {
    if (!selectedRecord) return;
    updateStatus(selectedRecord.id, newStatus, statusMessage || DELIVERY_STATUS_LABELS[newStatus], "Admin");
    setUpdateOpen(false);
    setStatusMessage("");
    setSelectedRecord({ ...selectedRecord, currentStatus: newStatus });
  };

  const handleCancel = () => {
    if (!selectedRecord) return;
    cancelDelivery(selectedRecord.id, cancelReason, "Admin");
    setCancelOpen(false);
    setCancelReason("");
    setDetailOpen(false);
  };

  const handleAddRecord = () => {
    if (!newRecord.orderId || !newRecord.customerName || !newRecord.deliveryAddress) return;
    addRecord({ ...newRecord, estimatedDeliveryDate: newRecord.estimatedDeliveryDate || new Date(Date.now() + 7 * 86400000).toISOString() });
    setAddOpen(false);
    setNewRecord({ orderId: "", customerName: "", deliveryAddress: "", estimatedDeliveryDate: "", remarks: "" });
  };

  const openDetail = (record: TrackingRecord) => {
    setSelectedRecord(record);
    setDetailOpen(true);
  };

  const openUpdate = (record: TrackingRecord) => {
    setSelectedRecord(record);
    const currentIdx = DELIVERY_STATUS_ORDER.indexOf(record.currentStatus);
    const nextStatus = currentIdx < DELIVERY_STATUS_ORDER.length - 1 ? DELIVERY_STATUS_ORDER[currentIdx + 1] : record.currentStatus;
    setNewStatus(nextStatus);
    setUpdateOpen(true);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <DashboardLayout title="Delivery Tracking" subtitle="Manage and monitor all deliveries">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Delivery Tracking</h1>
            <p className="text-muted-foreground">Manage and monitor all deliveries</p>
          </div>
          <Button onClick={() => setAddOpen(true)} className="btn-gradient rounded-xl">
            <Plus className="h-4 w-4 mr-2" /> Create Tracking
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Deliveries", value: stats.total, icon: Package, color: "text-primary" },
            { label: "In Transit", value: stats.inTransit, icon: Truck, color: "text-purple-600" },
            { label: "Delivered", value: stats.delivered, icon: CheckCircle, color: "text-green-600" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
          ].map((s) => (
            <Card key={s.label} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="management" className="space-y-4">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="management">Tracking Management</TabsTrigger>
            <TabsTrigger value="history">History & Timeline</TabsTrigger>
          </TabsList>

          {/* Tab 1: Management */}
          <TabsContent value="management">
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by Order ID, Customer, Tracking ID..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[200px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="All Statuses" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.entries(DELIVERY_STATUS_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Est. Delivery</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No tracking records found</TableCell></TableRow>
                    ) : (
                      filtered.map((r) => {
                        const StatusIcon = statusIcons[r.currentStatus];
                        return (
                          <TableRow key={r.id} className="cursor-pointer hover:bg-muted/30" onClick={() => openDetail(r)}>
                            <TableCell className="font-medium">{r.id}</TableCell>
                            <TableCell>{r.orderId}</TableCell>
                            <TableCell>{r.customerName}</TableCell>
                            <TableCell>{formatDate(r.estimatedDeliveryDate)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[r.currentStatus]}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {DELIVERY_STATUS_LABELS[r.currentStatus]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{formatDateTime(r.lastUpdated)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" variant="ghost" onClick={() => openDetail(r)}><Eye className="h-4 w-4" /></Button>
                                {!["delivered", "cancelled", "failed"].includes(r.currentStatus) && (
                                  <>
                                    <Button size="sm" variant="ghost" onClick={() => openUpdate(r)}><RefreshCw className="h-4 w-4" /></Button>
                                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setSelectedRecord(r); setCancelOpen(true); }}><Ban className="h-4 w-4" /></Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: History */}
          <TabsContent value="history">
            <Card className="border-border/50">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search history..." className="pl-10" value={historySearch} onChange={(e) => setHistorySearch(e.target.value)} />
                  </div>
                  <Select value={historyStatusFilter} onValueChange={setHistoryStatusFilter}>
                    <SelectTrigger className="w-[200px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="All Statuses" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {Object.entries(DELIVERY_STATUS_LABELS).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {historyFiltered.length === 0 ? (
                    <p className="text-center py-10 text-muted-foreground">No records found</p>
                  ) : (
                    historyFiltered.map((r) => (
                      <Card key={r.id} className="border-border/50">
                        <CardHeader className="pb-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <CardTitle className="text-base">{r.id} — {r.orderId}</CardTitle>
                              <p className="text-sm text-muted-foreground">{r.customerName}</p>
                            </div>
                            <Badge variant="outline" className={statusColors[r.currentStatus]}>
                              {DELIVERY_STATUS_LABELS[r.currentStatus]}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {/* Timeline */}
                          <div className="relative pl-6 space-y-4">
                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
                            {r.statusHistory.map((entry, idx) => {
                              const Icon = statusIcons[entry.status] || Package;
                              const isLast = idx === r.statusHistory.length - 1;
                              return (
                                <div key={entry.id} className="relative flex gap-3">
                                  <div className={`absolute -left-4 top-1 h-4 w-4 rounded-full flex items-center justify-center ${isLast ? "bg-primary" : "bg-muted"}`}>
                                    <Icon className={`h-2.5 w-2.5 ${isLast ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="font-medium text-sm text-foreground">{DELIVERY_STATUS_LABELS[entry.status]}</span>
                                      <span className="text-xs text-muted-foreground">• {formatDateTime(entry.updatedAt)}</span>
                                      <span className="text-xs text-muted-foreground">by {entry.updatedBy}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5">{entry.message}</p>
                                    {entry.remarks && <p className="text-xs text-muted-foreground italic mt-0.5">Note: {entry.remarks}</p>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {r.currentStatus === "delivered" && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="h-4 w-4" /> Delivery verified complete
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tracking Details — {selectedRecord?.id}</DialogTitle>
            <DialogDescription>Full delivery information and status timeline</DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">Order ID</p><p className="font-medium">{selectedRecord.orderId}</p></div>
                <div><p className="text-muted-foreground">Customer</p><p className="font-medium">{selectedRecord.customerName}</p></div>
                <div className="col-span-2"><p className="text-muted-foreground">Delivery Address</p><p className="font-medium">{selectedRecord.deliveryAddress}</p></div>
                <div><p className="text-muted-foreground">Est. Delivery</p><p className="font-medium">{formatDate(selectedRecord.estimatedDeliveryDate)}</p></div>
                <div><p className="text-muted-foreground">Current Status</p>
                  <Badge variant="outline" className={statusColors[selectedRecord.currentStatus]}>
                    {DELIVERY_STATUS_LABELS[selectedRecord.currentStatus]}
                  </Badge>
                </div>
              </div>
              {selectedRecord.remarks && (
                <div className="text-sm"><p className="text-muted-foreground">Remarks</p><p className="font-medium">{selectedRecord.remarks}</p></div>
              )}
              <div>
                <p className="text-sm font-medium mb-3">Status Timeline</p>
                <div className="relative pl-6 space-y-3">
                  <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-border" />
                  {selectedRecord.statusHistory.map((entry, idx) => {
                    const Icon = statusIcons[entry.status] || Package;
                    const isLast = idx === selectedRecord.statusHistory.length - 1;
                    return (
                      <div key={entry.id} className="relative flex gap-3">
                        <div className={`absolute -left-4 top-1 h-4 w-4 rounded-full flex items-center justify-center ${isLast ? "bg-primary" : "bg-muted"}`}>
                          <Icon className={`h-2.5 w-2.5 ${isLast ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{DELIVERY_STATUS_LABELS[entry.status]}</p>
                          <p className="text-xs text-muted-foreground">{entry.message}</p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(entry.updatedAt)} — {entry.updatedBy}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {!["delivered", "cancelled", "failed"].includes(selectedRecord.currentStatus) && (
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => { setCancelOpen(true); }}>
                    <Ban className="h-4 w-4 mr-2" /> Cancel Delivery
                  </Button>
                  <Button onClick={() => { setDetailOpen(false); openUpdate(selectedRecord); }}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Update Status
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
            <DialogDescription>Update status for {selectedRecord?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as DeliveryStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(DELIVERY_STATUS_LABELS).filter(([k]) => !["cancelled"].includes(k)).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Status Message</label>
              <Textarea placeholder="Enter a message for this status update..." value={statusMessage} onChange={(e) => setStatusMessage(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Delivery</DialogTitle>
            <DialogDescription>This action cannot be undone. Please provide a reason.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Reason for cancellation..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>Go Back</Button>
            <Button variant="destructive" onClick={handleCancel} disabled={!cancelReason}>Confirm Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Tracking Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Tracking Record</DialogTitle>
            <DialogDescription>Create a new delivery tracking entry</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Order ID</label><Input placeholder="ORD-2024-XXX" value={newRecord.orderId} onChange={(e) => setNewRecord({ ...newRecord, orderId: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Customer Name</label><Input value={newRecord.customerName} onChange={(e) => setNewRecord({ ...newRecord, customerName: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Delivery Address</label><Textarea value={newRecord.deliveryAddress} onChange={(e) => setNewRecord({ ...newRecord, deliveryAddress: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Est. Delivery Date</label><Input type="date" value={newRecord.estimatedDeliveryDate} onChange={(e) => setNewRecord({ ...newRecord, estimatedDeliveryDate: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Remarks (optional)</label><Textarea value={newRecord.remarks} onChange={(e) => setNewRecord({ ...newRecord, remarks: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddRecord} disabled={!newRecord.orderId || !newRecord.customerName || !newRecord.deliveryAddress}>Create Tracking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Tracking;
