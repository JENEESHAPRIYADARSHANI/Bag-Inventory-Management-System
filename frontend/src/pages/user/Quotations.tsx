import { useState, useEffect } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotations } from "@/contexts/QuotationContext";
import { Quotation, QuotationItem, QuotationStatus } from "@/types/quotation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  Building2,
  RefreshCw,
  X,
  Eye,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<QuotationStatus, { label: string; icon: typeof Clock; className: string }> = {
  draft: {
    label: "Draft",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  sent: {
    label: "Sent - Under Review",
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle,
    className: "bg-info/10 text-info border-info/20",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  converted: {
    label: "Converted to Order",
    icon: ArrowRightLeft,
    className: "bg-primary/10 text-primary border-primary/20",
  },
};

const UserQuotations = () => {
  const { user } = useAuth();
  const { getQuotationsByUser, updateQuotation, refreshQuotations, loading } = useQuotations();
  const quotations = user ? getQuotationsByUser(user.id) : [];
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingItems, setEditingItems] = useState<QuotationItem[] | null>(null);

  const sorted = [...quotations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Refresh quotations on mount
  useEffect(() => {
    refreshQuotations();
  }, []);

  const handleRefresh = async () => {
    await refreshQuotations();
    toast.success("Quotations refreshed");
  };

  const openDetail = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setEditingItems(quotation.items.map((item) => ({ ...item })));
    setIsDetailOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedQuotation || !editingItems) return;
    try {
      await updateQuotation(selectedQuotation.id, { items: editingItems });
      setIsDetailOpen(false);
    } catch (error) {
      // Error is handled in context
    }
  };

  const handleItemPriceChange = (index: number, field: "unitPrice" | "discount", value: number) => {
    if (!editingItems) return;
    setEditingItems((prev) =>
      prev!.map((item, i) => {
        if (i !== index) return item;
        const updated = { ...item, [field]: value };
        updated.total = updated.quantity * updated.unitPrice * (1 - updated.discount / 100);
        return updated;
      })
    );
  };

  const editingTotal = editingItems?.reduce((sum, item) => sum + item.total, 0) || 0;

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              My Quotations
            </h1>
            <p className="text-muted-foreground">Track the status of your quotation requests</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Link to="/user/request-quotation">
              <Button className="btn-gradient gap-2">
                <Plus className="h-4 w-4" />
                New Quotation
              </Button>
            </Link>
          </div>
        </div>

        {quotations.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-foreground mb-2">No quotations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Request a quotation for corporate bulk orders
              </p>
              <Link to="/user/request-quotation">
                <Button className="btn-gradient gap-2">
                  <Plus className="h-4 w-4" />
                  Request Quotation
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sorted.map((quotation) => {
              const config = statusConfig[quotation.status];
              const StatusIcon = config.icon;

              return (
                <Card key={quotation.id} className="border-border/50 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">#{quotation.id}</CardTitle>
                          <p className="text-sm text-muted-foreground">{quotation.companyName}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("font-medium", config.className)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {quotation.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.productName} × {item.quantity}
                          </span>
                          <span className="font-medium">${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex flex-wrap justify-between items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        Requested on{" "}
                        {new Date(quotation.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground mr-2">Total:</span>
                        <span className="text-lg font-bold text-primary">
                          ${quotation.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    {quotation.status === "rejected" && quotation.rejectionReason && (
                      <div className="mt-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                        <p className="text-sm text-destructive">
                          <strong>Reason:</strong> {quotation.rejectionReason}
                        </p>
                      </div>
                    )}
                    {quotation.status === "converted" && quotation.convertedOrderId && (
                      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-sm text-primary">
                          <strong>Order Created:</strong> {quotation.convertedOrderId}
                        </p>
                      </div>
                    )}
                    
                    {/* Action buttons based on status */}
                    <div className="mt-3 flex gap-2">
                      {quotation.status === "draft" && (
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => openDetail(quotation)}
                        >
                          <Edit className="h-4 w-4" />
                          Edit Quotation
                        </Button>
                      )}
                      
                      {quotation.status !== "draft" && (
                        <Button
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => openDetail(quotation)}
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail / Edit Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Quotation #{selectedQuotation?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedQuotation && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid gap-3 sm:grid-cols-2 p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedQuotation.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Contact</p>
                  <p className="font-medium">{selectedQuotation.contactPerson}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedQuotation.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedQuotation.phone || "N/A"}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">Products</h3>
                <div className="space-y-3">
                  {editingItems?.map((item, index) => (
                    <div
                      key={index}
                      className="grid gap-3 sm:grid-cols-[1fr_90px_90px_90px] items-end p-3 rounded-lg border border-border"
                    >
                      <div>
                        <Label className="text-xs">Product</Label>
                        <p className="font-medium text-sm">{item.productName} × {item.quantity}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Unit Price</Label>
                        {selectedQuotation.status === "draft" ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemPriceChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <p className="font-medium text-sm">${item.unitPrice.toFixed(2)}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Discount %</Label>
                        {selectedQuotation.status === "draft" ? (
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={item.discount}
                            onChange={(e) => handleItemPriceChange(index, "discount", parseFloat(e.target.value) || 0)}
                            className="h-8 text-sm"
                          />
                        ) : (
                          <p className="font-medium text-sm">{item.discount}%</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs">Line Total</Label>
                        <p className="font-semibold text-sm text-primary">${item.total.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-3 text-lg">
                  <span className="mr-3 font-medium">Total:</span>
                  <span className="font-bold text-primary">${editingTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Special Notes */}
              {selectedQuotation.specialNotes && (
                <div>
                  <h3 className="font-semibold mb-2">Special Notes</h3>
                  <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                    {selectedQuotation.specialNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-wrap gap-2">
            {selectedQuotation?.status === "draft" && (
              <Button className="btn-gradient gap-1" onClick={handleSaveChanges}>
                <Edit className="h-4 w-4" />
                Save Changes
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </UserLayout>
  );
};

export default UserQuotations;