// src/services/orderApi.ts
const BASE_URL = import.meta.env.VITE_ORDER_API_URL || "http://localhost:8083";

const ORDERS_PATH = "/orders";

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
  totalAmount?: number | null;
  deliveryDate?: string | null;
  productIds: string;
  quantities: string;
  orderDate?: string;
  status?: OrderStatus;
}
async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchOrders(): Promise<OrderDto[]> {
  const res = await fetch(`${BASE_URL}/orders`);
  return handleJson<OrderDto[]>(res);
}

export async function fetchOrdersForCustomer(customerId: number): Promise<OrderDto[]> {
  const res = await fetch(`${BASE_URL}/orders/customer/${customerId}`);
  return handleJson<OrderDto[]>(res);
}

export async function createOrder(payload: OrderDto): Promise<OrderDto> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleJson<OrderDto>(res);
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<OrderDto> {
  const res = await fetch(`${BASE_URL}/orders/${id}?status=${encodeURIComponent(status)}`, {
    method: "PUT",
  });
  return handleJson<OrderDto>(res);
}

export async function requestCancel(id: number): Promise<OrderDto> {
  const res = await fetch(`${BASE_URL}/orders/${id}/cancel-request`, { method: "PUT" });
  return handleJson<OrderDto>(res);
}

export async function approveCancel(id: number): Promise<OrderDto> {
  const res = await fetch(`${BASE_URL}/orders/${id}/cancel-approve`, { method: "PUT" });
  return handleJson<OrderDto>(res);
}

export async function rejectCancel(id: number): Promise<OrderDto> {
  const res = await fetch(`${BASE_URL}/orders/${id}/cancel-reject`, { method: "PUT" });
  return handleJson<OrderDto>(res);
}