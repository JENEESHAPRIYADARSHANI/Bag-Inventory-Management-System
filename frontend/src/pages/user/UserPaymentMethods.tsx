import { UserLayout } from "@/components/layout/UserLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Loader2, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { savedMethodApi, SavedMethodRequest, SavedMethodResponse } from "@/services/paymentApi";

interface PaymentMethod {
  id: number;
  cardHolderName: string;
  maskedCardNumber: string;
  expiryDate: string;
  cardType: string;
  isActive: boolean;
}

const UserPaymentMethods = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardType, setCardType] = useState("Visa");

  // Load payment methods from backend
  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await savedMethodApi.getMethods();
      
      // Map backend response to frontend format
      const mappedMethods: PaymentMethod[] = methods.map((m: SavedMethodResponse) => ({
        id: m.id,
        cardHolderName: m.cardHolderName,
        maskedCardNumber: `**** **** **** ${m.last4}`,
        expiryDate: `${String(m.expiryMonth).padStart(2, '0')}/${String(m.expiryYear).slice(-2)}`,
        cardType: m.brand || 'Card',
        isActive: m.status === 'ACTIVE',
      }));
      
      setPaymentMethods(mappedMethods);
    } catch (error) {
      console.error("Failed to load payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  // Format Card Number (1234 5678 9012 3456)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 16);
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
    return formatted;
  };

  // Format Expiry (MM/YY)
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    }
    return cleaned;
  };

  // Detect card type from number
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Card';
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to manage payment methods");
      return;
    }

    if (
      !cardName ||
      cardNumber.length < 19 ||
      expiry.length < 5 ||
      cvv.length < 3
    ) {
      toast.error("Please enter valid card details");
      return;
    }

    try {
      setSubmitting(true);

      // Parse expiry date
      const [month, year] = expiry.split('/');
      const fullYear = parseInt(`20${year}`);
      const last4 = cardNumber.replace(/\s/g, '').slice(-4);

      if (editingPaymentId) {
        // Update existing method
        const request: Partial<SavedMethodRequest> = {
          cardHolderName: cardName,
          last4: last4,
          expiryMonth: parseInt(month),
          expiryYear: fullYear,
          brand: cardType,
        };

        await savedMethodApi.updateMethod(editingPaymentId, request);
        toast.success("Payment method updated!");
      } else {
        // Add new method
        const request: SavedMethodRequest = {
          customerName: user.name,
          type: 'Card',
          cardHolderName: cardName,
          last4: last4,
          expiryMonth: parseInt(month),
          expiryYear: fullYear,
          brand: cardType,
          status: 'ACTIVE',
        };

        await savedMethodApi.addMethod(request);
        toast.success("Payment method added!");
      }

      // Reload methods
      await loadPaymentMethods();

      // Reset form
      setIsAddingPayment(false);
      setEditingPaymentId(null);
      setCardName("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setCardType("Visa");
    } catch (error) {
      console.error("Failed to save payment method:", error);
      toast.error("Failed to save payment method");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (payment: PaymentMethod) => {
    setEditingPaymentId(payment.id);
    setCardName(payment.cardHolderName);
    setCardNumber(`**** **** **** ${payment.maskedCardNumber.slice(-4)}`);
    setExpiry(payment.expiryDate);
    setCvv("***"); // Placeholder
    setCardType(payment.cardType);
    setIsAddingPayment(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await savedMethodApi.deleteMethod(id);
      toast.success("Payment method deleted!");
      await loadPaymentMethods();
    } catch (error) {
      console.error("Failed to delete payment method:", error);
      toast.error("Failed to delete payment method");
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
  };

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Payment Methods</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Saved Cards
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setIsAddingPayment(true);
                  setEditingPaymentId(null);
                  setCardName("");
                  setCardNumber("");
                  setExpiry("");
                  setCvv("");
                  setCardType("Visa");
                }}
                disabled={loading}
              >
                + Add New
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-muted-foreground text-sm">
                  No payment methods added yet.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsAddingPayment(true)}
                >
                  Add Your First Card
                </Button>
              </div>
            ) : (
              paymentMethods.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{payment.cardHolderName}</p>
                        <Badge variant="outline" className="text-xs">
                          {payment.cardType}
                        </Badge>
                        {!payment.isActive && (
                          <Badge variant="destructive" className="text-xs">
                            Disabled
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-mono">
                        {payment.maskedCardNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires {payment.expiryDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(payment)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(payment.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}

            {isAddingPayment && (
              <div className="space-y-4 border-t pt-4 mt-4">
                <h3 className="font-semibold">
                  {editingPaymentId ? "Edit" : "Add"} Payment Method
                </h3>

                <div className="space-y-2">
                  <Label>Cardholder Name</Label>
                  <Input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input
                    value={cardNumber}
                    onChange={(e) => handleCardNumberChange(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    disabled={submitting || !!editingPaymentId}
                  />
                  {cardType && (
                    <p className="text-xs text-muted-foreground">
                      Detected: {cardType}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Expiry (MM/YY)</Label>
                    <Input
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(formatExpiry(e.target.value))
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      type="password"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(
                          e.target.value.replace(/\D/g, "").slice(0, 4)
                        )
                      }
                      placeholder="123"
                      maxLength={4}
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>{editingPaymentId ? "Update" : "Add"} Payment</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingPayment(false);
                      setEditingPaymentId(null);
                      setCardName("");
                      setCardNumber("");
                      setExpiry("");
                      setCvv("");
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Secure Payment Storage</p>
                <p className="text-xs text-muted-foreground">
                  Your payment information is encrypted and stored securely. We never store your full card number or CVV.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
};

export default UserPaymentMethods;