const BASE_URL = "http://localhost:8081/api/v1/logistics";

// Types matching backend DTOs
export interface CreateTrackingRequest {
  orderId: string;
  customerName: string;
  deliveryAddress: string;
  recipientPhone: string;
  carrierName?: string;
  estimatedDeliveryDate?: string;
  remarks?: string;
}

export interface UpdateStatusRequest {
  status: string;
  message: string;
  location?: string;
  updatedBy: string;
  remarks?: string;
}

export interface UpdateTrackingRequest {
  carrierName?: string;
  estimatedDeliveryDate?: string;
  deliveryAddress?: string;
  recipientPhone?: string;
  remarks?: string;
}

export interface DeliveryTrackingResponse {
  id: number;
  trackingId: string;
  orderId: string;
  carrierName: string;
  currentStatus: string;
  currentLocation: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string | null;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  remarks: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingHistoryResponse {
  id: number;
  status: string;
  location: string;
  message: string;
  updatedBy: string;
  remarks: string;
  updatedAt: string;
}

// Admin Operations
export async function createTracking(data: CreateTrackingRequest): Promise<DeliveryTrackingResponse> {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create tracking");
  return res.json();
}

export async function getAllTrackings(): Promise<DeliveryTrackingResponse[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch trackings");
  return res.json();
}

export async function getTrackingById(trackingId: string): Promise<DeliveryTrackingResponse> {
  const res = await fetch(`${BASE_URL}/${trackingId}`);
  if (!res.ok) throw new Error("Failed to fetch tracking");
  return res.json();
}

export async function getTrackingByOrderId(orderId: string): Promise<DeliveryTrackingResponse> {
  const res = await fetch(`${BASE_URL}/order/${orderId}`);
  if (!res.ok) throw new Error("Failed to fetch tracking");
  return res.json();
}

export async function updateTrackingStatus(
  trackingId: string,
  data: UpdateStatusRequest
): Promise<DeliveryTrackingResponse> {
  const res = await fetch(`${BASE_URL}/${trackingId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update status");
  return res.json();
}

export async function updateTracking(
  trackingId: string,
  data: UpdateTrackingRequest
): Promise<DeliveryTrackingResponse> {
  const res = await fetch(`${BASE_URL}/${trackingId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update tracking");
  return res.json();
}

export async function addTrackingNotes(trackingId: string, notes: string): Promise<DeliveryTrackingResponse> {
  const res = await fetch(`${BASE_URL}/${trackingId}/notes?notes=${encodeURIComponent(notes)}`, {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to add notes");
  return res.json();
}

export async function cancelDelivery(
  trackingId: string,
  reason: string,
  cancelledBy: string
): Promise<DeliveryTrackingResponse> {
  const res = await fetch(
    `${BASE_URL}/${trackingId}/cancel?reason=${encodeURIComponent(reason)}&cancelledBy=${encodeURIComponent(cancelledBy)}`,
    { method: "PUT" }
  );
  if (!res.ok) throw new Error("Failed to cancel delivery");
  return res.json();
}

export async function deleteTracking(trackingId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${trackingId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete tracking");
}

// History & Timeline
export async function getTrackingHistory(trackingId: string): Promise<TrackingHistoryResponse[]> {
  const res = await fetch(`${BASE_URL}/${trackingId}/history`);
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

export async function getDetailedHistory(trackingId: string): Promise<TrackingHistoryResponse[]> {
  const res = await fetch(`${BASE_URL}/${trackingId}/history/details`);
  if (!res.ok) throw new Error("Failed to fetch detailed history");
  return res.json();
}

export async function filterByStatus(status: string): Promise<DeliveryTrackingResponse[]> {
  const res = await fetch(`${BASE_URL}/history/status/${status}`);
  if (!res.ok) throw new Error("Failed to filter by status");
  return res.json();
}

export async function filterByDateRange(
  startDate: string,
  endDate: string
): Promise<DeliveryTrackingResponse[]> {
  const res = await fetch(
    `${BASE_URL}/history/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
  );
  if (!res.ok) throw new Error("Failed to filter by date range");
  return res.json();
}

export async function filterByStatusAndDateRange(
  status: string,
  startDate: string,
  endDate: string
): Promise<DeliveryTrackingResponse[]> {
  const res = await fetch(
    `${BASE_URL}/history/filter?status=${status}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
  );
  if (!res.ok) throw new Error("Failed to filter");
  return res.json();
}

// Search & Filter
export async function searchTrackings(query: string): Promise<DeliveryTrackingResponse[]> {
  const res = await fetch(`${BASE_URL}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search");
  return res.json();
}

export async function filterTrackingsByStatus(status: string): Promise<DeliveryTrackingResponse[]> {
  const res = await fetch(`${BASE_URL}/filter/status/${status}`);
  if (!res.ok) throw new Error("Failed to filter by status");
  return res.json();
}

export async function filterTrackingsByDateRange(
  startDate: string,
  endDate: string
): Promise<DeliveryTrackingResponse[]> {
  const res = await fetch(
    `${BASE_URL}/filter/date-range?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`
  );
  if (!res.ok) throw new Error("Failed to filter by date range");
  return res.json();
}

export async function filterTrackings(
  status?: string,
  startDate?: string,
  endDate?: string
): Promise<DeliveryTrackingResponse[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  
  const res = await fetch(`${BASE_URL}/filter?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to filter trackings");
  return res.json();
}

// Customer Read-Only Endpoints
export async function getCustomerTrackings(customerName: string): Promise<DeliveryTrackingResponse[]> {
  const res = await fetch(`${BASE_URL}/customer/${encodeURIComponent(customerName)}`);
  if (!res.ok) throw new Error("Failed to fetch customer trackings");
  return res.json();
}

export async function getCustomerOrderTracking(orderId: string): Promise<DeliveryTrackingResponse> {
  const res = await fetch(`${BASE_URL}/customer/order/${orderId}`);
  if (!res.ok) throw new Error("Failed to fetch order tracking");
  return res.json();
}

export async function getCustomerTimeline(trackingId: string): Promise<TrackingHistoryResponse[]> {
  const res = await fetch(`${BASE_URL}/customer/timeline/${trackingId}`);
  if (!res.ok) throw new Error("Failed to fetch timeline");
  return res.json();
}
