export type DeliveryStatus =
  | "order_confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "cancelled";

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  order_confirmed: "Order Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  failed: "Failed",
  cancelled: "Cancelled",
};

export const DELIVERY_STATUS_ORDER: DeliveryStatus[] = [
  "order_confirmed",
  "processing",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
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
