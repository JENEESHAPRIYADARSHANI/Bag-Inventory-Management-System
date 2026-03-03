import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Payment, SavedPaymentMethod, PaymentStatus, PaymentMethod } from "@/types/payment";
import { 
  paymentApi, 
  savedMethodApi,
  mapPaymentMethodToBackend,
  mapPaymentMethodToFrontend,
  mapPaymentStatusToBackend,
  mapPaymentStatusToFrontend,
  PaymentRequest,
  SavedMethodRequest
} from "@/services/paymentApi";
import { toast } from "sonner";

interface PaymentContextType {
  payments: Payment[];
  savedMethods: SavedPaymentMethod[];
  loading: boolean;
  addPayment: (payment: Omit<Payment, "id">) => Promise<void>;
  updatePayment: (id: string, updates: Partial<Payment>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  addSavedMethod: (method: Omit<SavedPaymentMethod, "id">) => Promise<void>;
  updateSavedMethod: (id: string, updates: Partial<SavedPaymentMethod>) => Promise<void>;
  deleteSavedMethod: (id: string) => Promise<void>;
  refreshPayments: () => Promise<void>;
  refreshSavedMethods: () => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch payments from backend
  const refreshPayments = async () => {
    try {
      const response = await paymentApi.getPayments({ size: 100 });
      
      // Handle empty response
      if (!response || !response.content) {
        setPayments([]);
        return;
      }
      
      const mappedPayments: Payment[] = response.content.map((p) => ({
        id: p.paymentId,
        orderId: p.orderId,
        customerName: p.customerName,
        amount: p.amount,
        method: mapPaymentMethodToFrontend(p.method),
        paymentDate: p.paymentDate,
        status: mapPaymentStatusToFrontend(p.status),
        transactionRef: p.txnRef,
      }));
      setPayments(mappedPayments);
    } catch (error: any) {
      console.error("Failed to fetch payments:", error);
      // Only show error if it's not a 404 (no data found)
      if (error?.response?.status !== 404) {
        toast.error("Failed to load payments");
      }
      setPayments([]);
    }
  };

  // Fetch saved methods from backend
  const refreshSavedMethods = async () => {
    try {
      const methods = await savedMethodApi.getMethods();
      
      // Handle empty array (no error, just no data)
      if (!methods || methods.length === 0) {
        setSavedMethods([]);
        return;
      }
      
      const mappedMethods: SavedPaymentMethod[] = methods.map((m) => ({
        id: String(m.id),
        methodType: (m.type?.toLowerCase() || 'card') as PaymentMethod,
        cardHolderName: m.cardHolderName || 'Unknown',
        maskedCardNumber: `**** **** **** ${m.last4 || '****'}`,
        expiryDate: `${String(m.expiryMonth || 1).padStart(2, '0')}/${String(m.expiryYear || 2025).slice(-2)}`,
      }));
      setSavedMethods(mappedMethods);
    } catch (error: any) {
      console.error("Failed to fetch saved methods:", error);
      // Only show error if it's not a 404 (no data found)
      if (error?.response?.status !== 404) {
        toast.error("Failed to load saved payment methods");
      }
      setSavedMethods([]);
    }
  };

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([refreshPayments(), refreshSavedMethods()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Add payment
  const addPayment = async (payment: Omit<Payment, "id">) => {
    try {
      const request: PaymentRequest = {
        orderId: payment.orderId,
        customerName: payment.customerName,
        amount: payment.amount,
        method: mapPaymentMethodToBackend(payment.method),
        status: mapPaymentStatusToBackend(payment.status),
        paymentDate: payment.paymentDate,
        txnRef: payment.transactionRef,
      };
      await paymentApi.createPayment(request);
      await refreshPayments();
      toast.success("Payment recorded successfully");
    } catch (error) {
      console.error("Failed to add payment:", error);
      toast.error("Failed to record payment");
      throw error;
    }
  };

  // Update payment
  const updatePayment = async (id: string, updates: Partial<Payment>) => {
    try {
      const request: Partial<PaymentRequest> = {};
      if (updates.orderId) request.orderId = updates.orderId;
      if (updates.customerName) request.customerName = updates.customerName;
      if (updates.amount !== undefined) request.amount = updates.amount;
      if (updates.method) request.method = mapPaymentMethodToBackend(updates.method);
      if (updates.status) request.status = mapPaymentStatusToBackend(updates.status);
      if (updates.paymentDate) request.paymentDate = updates.paymentDate;
      if (updates.transactionRef) request.txnRef = updates.transactionRef;

      // If only status is being updated, use the status endpoint
      if (updates.status && Object.keys(updates).length === 1) {
        await paymentApi.updatePaymentStatus(id, mapPaymentStatusToBackend(updates.status));
      } else {
        await paymentApi.updatePayment(id, request);
      }
      
      await refreshPayments();
      toast.success("Payment updated successfully");
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast.error("Failed to update payment");
      throw error;
    }
  };

  // Delete payment
  const deletePayment = async (id: string) => {
    try {
      await paymentApi.deletePayment(id);
      await refreshPayments();
      toast.success("Payment deleted successfully");
    } catch (error) {
      console.error("Failed to delete payment:", error);
      toast.error("Failed to delete payment");
      throw error;
    }
  };

  // Add saved method
  const addSavedMethod = async (method: Omit<SavedPaymentMethod, "id">) => {
    try {
      // Parse expiry date (MM/YY format)
      const [month, year] = method.expiryDate.split('/');
      const fullYear = parseInt(`20${year}`);
      
      // Extract last 4 digits from masked card number
      const last4 = method.maskedCardNumber.slice(-4);

      const request: SavedMethodRequest = {
        customerName: method.cardHolderName, // Using cardHolderName as customerName
        type: method.methodType.toUpperCase(),
        cardHolderName: method.cardHolderName,
        last4: last4,
        expiryMonth: parseInt(month),
        expiryYear: fullYear,
        brand: method.methodType === 'card' ? 'Visa' : 'Other', // Default brand
        status: 'ACTIVE',
      };
      
      await savedMethodApi.addMethod(request);
      await refreshSavedMethods();
      toast.success("Payment method added successfully");
    } catch (error) {
      console.error("Failed to add saved method:", error);
      toast.error("Failed to add payment method");
      throw error;
    }
  };

  // Update saved method
  const updateSavedMethod = async (id: string, updates: Partial<SavedPaymentMethod>) => {
    try {
      const request: Partial<SavedMethodRequest> = {};
      
      if (updates.cardHolderName) {
        request.cardHolderName = updates.cardHolderName;
        request.customerName = updates.cardHolderName;
      }
      
      if (updates.expiryDate) {
        const [month, year] = updates.expiryDate.split('/');
        request.expiryMonth = parseInt(month);
        request.expiryYear = parseInt(`20${year}`);
      }
      
      if (updates.maskedCardNumber) {
        request.last4 = updates.maskedCardNumber.slice(-4);
      }
      
      if (updates.methodType) {
        request.type = updates.methodType.toUpperCase();
      }

      await savedMethodApi.updateMethod(parseInt(id), request);
      await refreshSavedMethods();
      toast.success("Payment method updated successfully");
    } catch (error) {
      console.error("Failed to update saved method:", error);
      toast.error("Failed to update payment method");
      throw error;
    }
  };

  // Delete saved method
  const deleteSavedMethod = async (id: string) => {
    try {
      await savedMethodApi.deleteMethod(parseInt(id));
      await refreshSavedMethods();
      toast.success("Payment method deleted successfully");
    } catch (error) {
      console.error("Failed to delete saved method:", error);
      toast.error("Failed to delete payment method");
      throw error;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        savedMethods,
        loading,
        addPayment,
        updatePayment,
        deletePayment,
        addSavedMethod,
        updateSavedMethod,
        deleteSavedMethod,
        refreshPayments,
        refreshSavedMethods,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const context = useContext(PaymentContext);
  if (!context) throw new Error("usePayments must be used within PaymentProvider");
  return context;
}
