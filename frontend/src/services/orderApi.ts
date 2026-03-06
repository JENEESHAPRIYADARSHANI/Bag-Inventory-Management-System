import axios from "axios";

const ORDER_API_BASE_URL =
  import.meta.env.VITE_ORDER_API_URL || "http://localhost:8082";

const orderApi = axios.create({
  baseURL: ORDER_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "COMPLETED"
  | "CANCEL_REQUESTED"
  | "CANCELLED";

export interface OrderDto {
  id?: number;
  customerId: number;
  customerName?: string | null;
  quotationId?: number | null;
  totalAmount?: number | null;
  deliveryDate?: string | null;
  productIds: string;
  quantities: string;
  orderDate?: string;
  status?: OrderStatus;
}

function getErrorMessage(error: unknown): string {
  const axiosError = error as {
    response?: { data?: unknown };
    message?: string;
  };

  const data = axiosError.response?.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (typeof axiosError.message === "string" && axiosError.message.trim()) {
    return axiosError.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed";
}

export async function fetchOrders(): Promise<OrderDto[]> {
  try {
    const response = await orderApi.get("/orders");
    return response.data as OrderDto[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchOrdersForCustomer(customerId: number): Promise<OrderDto[]> {
  try {
    const response = await orderApi.get(`/orders/customer/${customerId}`);
    return response.data as OrderDto[];
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function fetchOrderById(id: number): Promise<OrderDto> {
  try {
    const response = await orderApi.get(`/orders/${id}`);
    return response.data as OrderDto;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function createOrder(payload: OrderDto): Promise<OrderDto> {
  try {
    const response = await orderApi.post("/orders", payload);
    return response.data as OrderDto;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateOrderStatus(
  id: number,
  status: "CONFIRMED" | "PROCESSING" | "COMPLETED"
): Promise<OrderDto> {
  try {
    const response = await orderApi.put(`/orders/${id}`, null, {
      params: { status },
    });
    return response.data as OrderDto;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function requestCancel(id: number): Promise<OrderDto> {
  try {
    const response = await orderApi.put(`/orders/${id}/cancel`);
    return response.data as OrderDto;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function adminCancelOrder(id: number): Promise<OrderDto> {
  try {
    const response = await orderApi.put(`/orders/${id}/admin-cancel`);
    return response.data as OrderDto;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export default {
  fetchOrders,
  fetchOrdersForCustomer,
  fetchOrderById,
  createOrder,
  updateOrderStatus,
  requestCancel,
  adminCancelOrder,
};