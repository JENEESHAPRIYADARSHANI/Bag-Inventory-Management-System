import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8085/api';
const API_DEBUG = import.meta.env.VITE_API_DEBUG === 'true';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
if (API_DEBUG) {
  api.interceptors.request.use((config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('API Error:', error.response?.status, error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
}

// ==================== PAYMENT TYPES ====================
export interface PaymentRequest {
  orderId: string;
  customerName: string;
  amount: number;
  method: 'CARD' | 'CASH' | 'ONLINE_TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentDate: string; // YYYY-MM-DD
  txnRef: string;
}

export interface PaymentResponse {
  paymentId: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: 'CARD' | 'CASH' | 'ONLINE_TRANSFER';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentDate: string;
  txnRef: string;
  verified: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ==================== SAVED METHOD TYPES ====================
export interface SavedMethodRequest {
  customerName: string;
  type: string;
  cardHolderName: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
  status: 'ACTIVE' | 'DISABLED';
}

export interface SavedMethodResponse {
  id: number;
  customerName: string;
  type: string;
  cardHolderName: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
}

// ==================== PAYMENT API ====================
export const paymentApi = {
  // Create payment
  createPayment: async (data: PaymentRequest): Promise<PaymentResponse> => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  // Get all payments with filters
  getPayments: async (params?: {
    search?: string;
    status?: string;
    method?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<PaymentResponse>> => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  // Get payment by ID
  getPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  },

  // Update payment
  updatePayment: async (paymentId: string, data: Partial<PaymentRequest>): Promise<PaymentResponse> => {
    const response = await api.put(`/payments/${paymentId}`, data);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (paymentId: string, status: 'PENDING' | 'COMPLETED' | 'FAILED'): Promise<PaymentResponse> => {
    const response = await api.patch(`/payments/${paymentId}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const response = await api.post(`/payments/${paymentId}/verify`);
    return response.data;
  },

  // Delete payment
  deletePayment: async (paymentId: string): Promise<void> => {
    await api.delete(`/payments/${paymentId}`);
  },

  // Get payment summary
  getSummary: async (fromDate?: string, toDate?: string): Promise<PaymentSummary> => {
    const response = await api.get('/payments/summary', {
      params: { fromDate, toDate }
    });
    return response.data;
  },

  // Get payment history
  getHistory: async (params?: {
    search?: string;
    status?: string;
    method?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
  }): Promise<PageResponse<PaymentResponse>> => {
    const response = await api.get('/payments/history', { params });
    return response.data;
  },
};

// ==================== SAVED METHOD API ====================
export const savedMethodApi = {
  // Add saved method
  addMethod: async (data: SavedMethodRequest): Promise<SavedMethodResponse> => {
    const response = await api.post('/payment-methods', data);
    return response.data;
  },

  // Get all saved methods
  getMethods: async (): Promise<SavedMethodResponse[]> => {
    const response = await api.get('/payment-methods');
    return response.data;
  },

  // Update saved method
  updateMethod: async (id: number, data: Partial<SavedMethodRequest>): Promise<SavedMethodResponse> => {
    const response = await api.put(`/payment-methods/${id}`, data);
    return response.data;
  },

  // Set method status
  setMethodStatus: async (id: number, status: 'ACTIVE' | 'DISABLED'): Promise<SavedMethodResponse> => {
    const response = await api.patch(`/payment-methods/${id}/status`, null, {
      params: { status }
    });
    return response.data;
  },

  // Delete saved method
  deleteMethod: async (id: number): Promise<void> => {
    await api.delete(`/payment-methods/${id}`);
  },
};

// ==================== HELPER FUNCTIONS ====================
export const mapPaymentMethodToBackend = (method: string): 'CARD' | 'CASH' | 'ONLINE_TRANSFER' => {
  const mapping: Record<string, 'CARD' | 'CASH' | 'ONLINE_TRANSFER'> = {
    'card': 'CARD',
    'cash': 'CASH',
    'online_transfer': 'ONLINE_TRANSFER',
  };
  return mapping[method.toLowerCase()] || 'CARD';
};

export const mapPaymentMethodToFrontend = (method: string): 'card' | 'cash' | 'online_transfer' => {
  const mapping: Record<string, 'card' | 'cash' | 'online_transfer'> = {
    'CARD': 'card',
    'CASH': 'cash',
    'ONLINE_TRANSFER': 'online_transfer',
  };
  return mapping[method.toUpperCase()] || 'card';
};

export const mapPaymentStatusToBackend = (status: string): 'PENDING' | 'COMPLETED' | 'FAILED' => {
  const mapping: Record<string, 'PENDING' | 'COMPLETED' | 'FAILED'> = {
    'pending': 'PENDING',
    'completed': 'COMPLETED',
    'failed': 'FAILED',
  };
  return mapping[status.toLowerCase()] || 'PENDING';
};

export const mapPaymentStatusToFrontend = (status: string): 'pending' | 'completed' | 'failed' => {
  const mapping: Record<string, 'pending' | 'completed' | 'failed'> = {
    'PENDING': 'pending',
    'COMPLETED': 'completed',
    'FAILED': 'failed',
  };
  return mapping[status.toUpperCase()] || 'pending';
};

export default api;
