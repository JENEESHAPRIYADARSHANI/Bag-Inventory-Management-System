export type QuotationStatus = "draft" | "sent" | "accepted" | "converted" | "rejected";

export interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
  total: number;
}

export interface Quotation {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  items: QuotationItem[];
  specialNotes: string;
  subtotal: number;
  totalAmount: number;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  adminNotes?: string;
  convertedOrderId?: string;
}
