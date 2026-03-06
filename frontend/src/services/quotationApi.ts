import axios from 'axios';
import { Quotation, QuotationItem } from '@/types/quotation';

// Backend API base URL - Update this to match your backend server
// Local development: 'http://localhost:8080/api'
// AWS Production: 'http://3.227.243.51:8080/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://3.227.243.51:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Backend types (matching Java DTOs)
interface BackendQuotationItem {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
  discount?: number;
}

interface BackendQuotationRequest {
  customerId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  items: BackendQuotationItem[];
}

interface BackendQuotation {
  id: number;
  customerId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: string; // DRAFT, SENT, ACCEPTED, CONVERTED
  totalAmount: number;
  items: Array<{
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    discount: number;
    lineTotal: number;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface BackendQuotationUpdateRequest {
  items: Array<{
    itemId: number;
    unitPrice?: number;
    discount?: number;
  }>;
}

interface BackendProduct {
  id: number;
  name: string;
  price: number;
}

// Map backend status to frontend status
const mapBackendStatus = (backendStatus: string): Quotation['status'] => {
  switch (backendStatus) {
    case 'DRAFT':
      return 'draft';
    case 'SENT':
      return 'approved'; // SENT means admin approved and sent to customer
    case 'ACCEPTED':
      return 'accepted'; // Customer accepted - ready to convert
    case 'REJECTED':
      return 'rejected'; // Quotation was rejected
    case 'CONVERTED':
      return 'converted';
    default:
      return 'draft';
  }
};

// Map frontend status to backend status
const mapFrontendStatus = (frontendStatus: Quotation['status']): string => {
  switch (frontendStatus) {
    case 'draft':
      return 'DRAFT';
    case 'approved':
      return 'SENT';
    case 'accepted':
      return 'ACCEPTED';
    case 'rejected':
      return 'REJECTED';
    case 'converted':
      return 'CONVERTED';
    default:
      return 'DRAFT';
  }
};

// Convert backend quotation to frontend format
const convertToFrontendQuotation = (backend: BackendQuotation, products: BackendProduct[]): Quotation => {
  const items: QuotationItem[] = backend.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      productId: item.productId.toString(),
      productName: product?.name || `Product ${item.productId}`,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      total: item.lineTotal,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return {
    id: `QT-${backend.id}`,
    companyName: backend.companyName,
    contactPerson: backend.contactPerson,
    email: backend.email,
    phone: backend.phone,
    items,
    specialNotes: '',
    subtotal,
    totalAmount: backend.totalAmount,
    status: mapBackendStatus(backend.status),
    createdAt: backend.createdAt || new Date().toISOString(),
    updatedAt: backend.updatedAt || new Date().toISOString(),
    userId: backend.customerId,
  };
};

// API Functions

/**
 * Get all products from backend
 */
export const getProducts = async (): Promise<BackendProduct[]> => {
  try {
    const response = await api.get<BackendProduct[]>('/quotations/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Create a new quotation
 */
export const createQuotation = async (
  quotation: Omit<Quotation, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'subtotal' | 'totalAmount'>
): Promise<Quotation> => {
  try {
    const request: BackendQuotationRequest = {
      customerId: quotation.userId,
      companyName: quotation.companyName,
      contactPerson: quotation.contactPerson,
      email: quotation.email,
      phone: quotation.phone,
      items: quotation.items.map(item => ({
        productId: parseInt(item.productId),
        quantity: item.quantity,
      })),
    };

    const response = await api.post<BackendQuotation>('/quotations', request);
    const products = await getProducts();
    return convertToFrontendQuotation(response.data, products);
  } catch (error) {
    console.error('Error creating quotation:', error);
    throw error;
  }
};

/**
 * Get all quotations
 */
export const getAllQuotations = async (): Promise<Quotation[]> => {
  try {
    const [quotationsResponse, products] = await Promise.all([
      api.get<BackendQuotation[]>('/quotations'),
      getProducts(),
    ]);
    
    return quotationsResponse.data.map(q => convertToFrontendQuotation(q, products));
  } catch (error) {
    console.error('Error fetching quotations:', error);
    throw error;
  }
};

/**
 * Get quotation by ID
 */
export const getQuotationById = async (id: string): Promise<Quotation> => {
  try {
    const backendId = id.replace('QT-', '');
    const [quotationResponse, products] = await Promise.all([
      api.get<BackendQuotation>(`/quotations/${backendId}`),
      getProducts(),
    ]);
    
    return convertToFrontendQuotation(quotationResponse.data, products);
  } catch (error) {
    console.error('Error fetching quotation:', error);
    throw error;
  }
};

/**
 * Search quotations by email
 */
export const searchQuotationsByEmail = async (email: string): Promise<Quotation[]> => {
  try {
    const [quotationsResponse, products] = await Promise.all([
      api.get<BackendQuotation[]>('/quotations/search', { params: { email } }),
      getProducts(),
    ]);
    
    return quotationsResponse.data.map(q => convertToFrontendQuotation(q, products));
  } catch (error) {
    console.error('Error searching quotations:', error);
    throw error;
  }
};

/**
 * Update quotation and send to customer (Admin only)
 */
export const updateAndSendQuotation = async (
  id: string,
  items: QuotationItem[]
): Promise<Quotation> => {
  try {
    const backendId = id.replace('QT-', '');
    
    // Get current quotation to get item IDs
    const currentQuotation = await api.get<BackendQuotation>(`/quotations/${backendId}`);
    
    const request: BackendQuotationUpdateRequest = {
      items: items.map((item, index) => ({
        itemId: currentQuotation.data.items[index].id,
        unitPrice: item.unitPrice,
        discount: item.discount,
      })),
    };

    const response = await api.put<BackendQuotation>(`/quotations/${backendId}/send`, request);
    const products = await getProducts();
    return convertToFrontendQuotation(response.data, products);
  } catch (error) {
    console.error('Error updating quotation:', error);
    throw error;
  }
};

/**
 * Accept quotation (Customer)
 */
export const acceptQuotation = async (id: string): Promise<Quotation> => {
  try {
    const backendId = id.replace('QT-', '');
    const response = await api.put<BackendQuotation>(`/quotations/${backendId}/accept`);
    const products = await getProducts();
    return convertToFrontendQuotation(response.data, products);
  } catch (error) {
    console.error('Error accepting quotation:', error);
    throw error;
  }
};

/**
 * Reject quotation (Admin only)
 */
export const rejectQuotation = async (id: string): Promise<Quotation> => {
  try {
    const backendId = id.replace('QT-', '');
    const response = await api.put<BackendQuotation>(`/quotations/${backendId}/reject`);
    const products = await getProducts();
    return convertToFrontendQuotation(response.data, products);
  } catch (error) {
    console.error('Error rejecting quotation:', error);
    throw error;
  }
};

/**
 * Delete quotation (Admin only - only DRAFT or REJECTED quotations)
 */
export const deleteQuotation = async (id: string): Promise<void> => {
  try {
    const backendId = id.replace('QT-', '');
    await api.delete(`/quotations/${backendId}`);
  } catch (error) {
    console.error('Error deleting quotation:', error);
    throw error;
  }
};

/**
 * Convert quotation to order (Admin only)
 */
export const convertQuotationToOrder = async (id: string): Promise<Quotation> => {
  try {
    const backendId = id.replace('QT-', '');
    const response = await api.post<BackendQuotation>(`/quotations/${backendId}/convert`);
    const products = await getProducts();
    return convertToFrontendQuotation(response.data, products);
  } catch (error) {
    console.error('Error converting quotation:', error);
    throw error;
  }
};

/**
 * Get all orders
 */
export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get orders by email
 */
export const getOrdersByEmail = async (email: string) => {
  try {
    const response = await api.get('/orders', { params: { email } });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders by email:', error);
    throw error;
  }
};

export default {
  getProducts,
  createQuotation,
  getAllQuotations,
  getQuotationById,
  searchQuotationsByEmail,
  updateAndSendQuotation,
  acceptQuotation,
  rejectQuotation,
  deleteQuotation,
  convertQuotationToOrder,
  getAllOrders,
  getOrdersByEmail,
};
