import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Quotation, QuotationItem, QuotationStatus } from "@/types/quotation";
import * as quotationApi from "@/services/quotationApi";
import { toast } from "sonner";

interface QuotationContextType {
  quotations: Quotation[];
  loading: boolean;
  createQuotation: (data: Omit<Quotation, "id" | "status" | "createdAt" | "updatedAt" | "subtotal" | "totalAmount"> & { items: QuotationItem[] }) => Promise<Quotation>;
  updateQuotation: (id: string, updates: Partial<Quotation>) => Promise<void>;
  updateQuotationStatus: (id: string, status: QuotationStatus, reason?: string) => Promise<void>;
  deleteQuotation: (id: string) => void;
  convertToOrder: (id: string) => Promise<string>;
  getQuotationsByUser: (userId: string) => Quotation[];
  refreshQuotations: () => Promise<void>;
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

// Flag to enable/disable API mode
const USE_API = true; // Set to false to use localStorage mode

function calculateTotals(items: QuotationItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const totalAmount = items.reduce((sum, item) => {
    const discountedPrice = item.unitPrice * (1 - item.discount / 100);
    return sum + item.quantity * discountedPrice;
  }, 0);
  return { subtotal, totalAmount };
}

export function QuotationProvider({ children }: { children: ReactNode }) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);

  // Load quotations on mount
  useEffect(() => {
    if (USE_API) {
      loadQuotationsFromAPI();
    } else {
      loadQuotationsFromLocalStorage();
    }
  }, []);

  // Save to localStorage when quotations change (only in localStorage mode)
  useEffect(() => {
    if (!USE_API) {
      localStorage.setItem("starbags_quotations", JSON.stringify(quotations));
    }
  }, [quotations]);

  const loadQuotationsFromLocalStorage = () => {
    const stored = localStorage.getItem("starbags_quotations");
    if (stored) {
      setQuotations(JSON.parse(stored));
    }
  };

  const loadQuotationsFromAPI = async () => {
    try {
      setLoading(true);
      const data = await quotationApi.getAllQuotations();
      setQuotations(data);
    } catch (error) {
      console.error('Failed to load quotations:', error);
      toast.error('Failed to load quotations from server');
      // Fallback to localStorage
      loadQuotationsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const refreshQuotations = async () => {
    if (USE_API) {
      await loadQuotationsFromAPI();
    }
  };

  const createQuotation = async (data: Omit<Quotation, "id" | "status" | "createdAt" | "updatedAt" | "subtotal" | "totalAmount"> & { items: QuotationItem[] }): Promise<Quotation> => {
    if (USE_API) {
      try {
        setLoading(true);
        const newQuotation = await quotationApi.createQuotation(data);
        setQuotations((prev) => [...prev, newQuotation]);
        toast.success('Quotation created successfully');
        return newQuotation;
      } catch (error) {
        console.error('Failed to create quotation:', error);
        toast.error('Failed to create quotation');
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      // LocalStorage mode
      const { subtotal, totalAmount } = calculateTotals(data.items);
      const itemsWithTotals = data.items.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice * (1 - item.discount / 100),
      }));

      const newQuotation: Quotation = {
        ...data,
        items: itemsWithTotals,
        id: `QT-${String(Date.now()).slice(-6)}`,
        status: "draft",
        subtotal,
        totalAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setQuotations((prev) => [...prev, newQuotation]);
      return newQuotation;
    }
  };

  const updateQuotation = async (id: string, updates: Partial<Quotation>) => {
    if (USE_API) {
      try {
        setLoading(true);
        
        // If updating items, send to backend
        if (updates.items) {
          await quotationApi.updateAndSendQuotation(id, updates.items);
          await refreshQuotations();
          toast.success('Quotation updated successfully');
        } else {
          // For other updates, just update locally
          setQuotations((prev) =>
            prev.map((q) => {
              if (q.id !== id) return q;
              return {
                ...q,
                ...updates,
                updatedAt: new Date().toISOString(),
              };
            })
          );
        }
      } catch (error) {
        console.error('Failed to update quotation:', error);
        toast.error('Failed to update quotation');
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      // LocalStorage mode
      setQuotations((prev) =>
        prev.map((q) => {
          if (q.id !== id || q.status === "approved" || q.status === "converted") return q;
          const updatedItems = updates.items || q.items;
          const { subtotal, totalAmount } = calculateTotals(updatedItems);
          return {
            ...q,
            ...updates,
            items: updatedItems.map((item) => ({
              ...item,
              total: item.quantity * item.unitPrice * (1 - item.discount / 100),
            })),
            subtotal,
            totalAmount,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    }
  };

  const updateQuotationStatus = async (id: string, status: QuotationStatus, reason?: string) => {
    if (USE_API) {
      try {
        setLoading(true);
        
        if (status === 'accepted') {
          // Accept quotation
          await quotationApi.acceptQuotation(id);
          await refreshQuotations();
          toast.success('Quotation accepted');
        } else if (status === 'rejected') {
          // Reject quotation
          await quotationApi.rejectQuotation(id);
          await refreshQuotations();
          toast.success('Quotation rejected');
        } else if (status === 'approved') {
          // This shouldn't happen from user side, but handle it
          toast.info('Quotation already approved');
        } else {
          // For other statuses, update locally
          setQuotations((prev) =>
            prev.map((q) =>
              q.id === id
                ? {
                    ...q,
                    status,
                    updatedAt: new Date().toISOString(),
                    ...(reason && status === "rejected" ? { rejectionReason: reason } : {}),
                  }
                : q
            )
          );
          toast.success(`Quotation ${status}`);
        }
      } catch (error) {
        console.error('Failed to update quotation status:', error);
        toast.error('Failed to update quotation status');
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      // LocalStorage mode
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === id
            ? {
                ...q,
                status,
                updatedAt: new Date().toISOString(),
                ...(reason && status === "rejected" ? { rejectionReason: reason } : {}),
              }
            : q
        )
      );
    }
  };

  const deleteQuotation = async (id: string) => {
    if (USE_API) {
      try {
        setLoading(true);
        await quotationApi.deleteQuotation(id);
        setQuotations((prev) => prev.filter((q) => q.id !== id));
        toast.success('Quotation deleted');
      } catch (error) {
        console.error('Failed to delete quotation:', error);
        toast.error('Failed to delete quotation. Only DRAFT or REJECTED quotations can be deleted.');
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      // LocalStorage mode
      setQuotations((prev) => {
        const q = prev.find((q) => q.id === id);
        if (q && q.status !== "rejected" && q.status !== "draft") return prev;
        return prev.filter((q) => q.id !== id);
      });
      toast.success('Quotation deleted');
    }
  };

  const convertToOrder = async (id: string): Promise<string> => {
    if (USE_API) {
      try {
        setLoading(true);
        const updatedQuotation = await quotationApi.convertQuotationToOrder(id);
        
        // Update local state
        setQuotations((prev) =>
          prev.map((q) =>
            q.id === id ? updatedQuotation : q
          )
        );
        
        const orderId = `ORD-${updatedQuotation.id.replace('QT-', '')}`;
        toast.success('Quotation converted to order');
        return orderId;
      } catch (error) {
        console.error('Failed to convert quotation:', error);
        toast.error('Failed to convert quotation to order');
        throw error;
      } finally {
        setLoading(false);
      }
    } else {
      // LocalStorage mode
      const orderId = `ORD-${String(Date.now()).slice(-6)}`;
      const quotation = quotations.find((q) => q.id === id);

      if (quotation && (quotation.status === "accepted" || quotation.status === "approved")) {
        // Create order in localStorage
        const existingOrders = JSON.parse(localStorage.getItem("starbags_orders") || "[]");
        const newOrder = {
          id: orderId,
          items: quotation.items.map((item) => ({
            id: item.productId,
            name: item.productName,
            price: item.unitPrice * (1 - item.discount / 100),
            quantity: item.quantity,
            image: "",
          })),
          total: quotation.totalAmount,
          status: "Processing",
          date: new Date().toISOString(),
          source: "quotation",
          quotationId: id,
        };
        existingOrders.push(newOrder);
        localStorage.setItem("starbags_orders", JSON.stringify(existingOrders));

        // Update quotation status
        setQuotations((prev) =>
          prev.map((q) =>
            q.id === id ? { ...q, convertedOrderId: orderId, status: "converted", updatedAt: new Date().toISOString() } : q
          )
        );
      }

      return orderId;
    }
  };

  const getQuotationsByUser = (userId: string) => {
    return quotations.filter((q) => q.userId === userId);
  };

  return (
    <QuotationContext.Provider
      value={{
        quotations,
        loading,
        createQuotation,
        updateQuotation,
        updateQuotationStatus,
        deleteQuotation,
        convertToOrder,
        getQuotationsByUser,
        refreshQuotations,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotations() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error("useQuotations must be used within a QuotationProvider");
  }
  return context;
}
