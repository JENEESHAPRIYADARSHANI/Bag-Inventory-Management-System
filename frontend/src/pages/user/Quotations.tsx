import { useState, useEffect } from "react";
import { UserLayout } from "@/components/layout/UserLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useQuotations } from "@/contexts/QuotationContext";
import { QuotationStatus } from "@/types/quotation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  ArrowRightLeft,
  Building2,
  RefreshCw,
  X,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig: Record<QuotationStatus, { label: string; icon: typeof Clock; className: string }> = {
  draft: {
    label: "Draft",
    icon: Clock,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  sent: {
    label: "Sent - Awaiting Your Response",
    icon: CheckCircle,
    className: "bg-info/10 text-info border-info/20",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle,
    className: "bg-success/10 text-success border-success/20",
  },
  converted: {
    label: "Converted to Order",
    icon: ArrowRightLeft,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  rejected: {
    label: "Rejected",
    icon: X,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const UserQuotations = () => {
  const { user } = useAuth();
  const { getQuotationsByUser, acceptQuotation, rejectQuotation, refreshQuotations, loading } = useQuotations();
  const quotations = user ? getQuotationsByUser(user.id) : [];

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

  const handleAccept = async (quotationId: string) => {
    if (!window.confirm("Are you sure you want to accept this quotation?")) {
      return;
    }
    
    try {
      await acceptQuotation(quotationId);
    } catch (error) {
      // Error is handled in context
    }
  };

  const handleReject = async (quotationId: string) => {
    if (!window.confirm("Are you sure you want to reject this quotation?")) {
      return;
    }
    
    try {
      await rejectQuotation(quotationId);
    } catch (error) {
      // Error is handled in context
    }
  };



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
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </Button>
            <Link to="/user/request-quotation">
              <Button className="btn-gradient gap-2">
                <Plus className="h-4 w-4" />
                New Quotation
              </Button>
            </Link>
          </div>
        </div>

        {sorted.length === 0 ? (
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
                          <CardTitle className="text-lg">{quotation.id}</CardTitle>
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
                    {quotation.status === "converted" && quotation.convertedOrderId && (
                      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-sm text-primary">
                          <strong>Order Created:</strong> {quotation.convertedOrderId}
                        </p>
                      </div>
                    )}
                    {quotation.status === "sent" && (
                      <div className="mt-3 flex gap-2">
                        <Button
                          className="flex-1 btn-gradient gap-2"
                          onClick={() => handleAccept(quotation.id)}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Accept Quotation
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-destructive border-destructive/50 hover:bg-destructive/10 gap-2"
                          onClick={() => handleReject(quotation.id)}
                        >
                          <ThumbsDown className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}
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

export default UserQuotations;
