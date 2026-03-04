// Backend uses uppercase with underscores
export type DeliveryStatus =
  | "ORDER_CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "FAILED"
  | "CANCELLED";

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  ORDER_CONFIRMED: "Order Confirmed",
  PROCESSING: "Processing",
  PACKED: "Packed",
  SHIPPED: "Shipped",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
};

export const DELIVERY_STATUS_ORDER: DeliveryStatus[] = [
  "ORDER_CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export interface StatusHistoryEntry {
  id: string;
  status: DeliveryStatus;
  message: string;
  updatedAt: string;
  updatedBy: string;
  remarks?: string;
}

export interface TrackingRecord {
  id: string;
  orderId: string;
  customerName: string;
  deliveryAddress: string;
  estimatedDeliveryDate: string;
  currentStatus: DeliveryStatus;
  statusHistory: StatusHistoryEntry[];
  remarks: string;
  createdAt: string;
  lastUpdated: string;
}
