import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { TrackingRecord, DeliveryStatus, StatusHistoryEntry, DELIVERY_STATUS_LABELS } from "@/types/tracking";

interface TrackingContextType {
  records: TrackingRecord[];
  addRecord: (data: Omit<TrackingRecord, "id" | "statusHistory" | "currentStatus" | "createdAt" | "lastUpdated">) => TrackingRecord;
  updateStatus: (trackingId: string, status: DeliveryStatus, message: string, updatedBy: string, remarks?: string) => void;
  cancelDelivery: (trackingId: string, reason: string, updatedBy: string) => void;
  getRecord: (trackingId: string) => TrackingRecord | undefined;
  getByOrderId: (orderId: string) => TrackingRecord | undefined;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

const STORAGE_KEY = "starbags_tracking";

const loadRecords = (): TrackingRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  // Seed demo data
  const now = new Date();
  const seed: TrackingRecord[] = [
    {
      id: "TRK-001",
      orderId: "ORD-2024-001",
      customerName: "ABC Corporation",
      deliveryAddress: "123 Business Park, Chennai, TN 600001",
      estimatedDeliveryDate: new Date(now.getTime() + 3 * 86400000).toISOString(),
      currentStatus: "shipped",
      remarks: "",
      createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      lastUpdated: new Date(now.getTime() - 4 * 3600000).toISOString(),
      statusHistory: [
        { id: "h1", status: "order_confirmed", message: "Order has been confirmed", updatedAt: new Date(now.getTime() - 2 * 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h2", status: "processing", message: "Order is being processed", updatedAt: new Date(now.getTime() - 1.5 * 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h3", status: "packed", message: "Items packed and ready", updatedAt: new Date(now.getTime() - 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h4", status: "shipped", message: "Shipment dispatched via BlueDart", updatedAt: new Date(now.getTime() - 4 * 3600000).toISOString(), updatedBy: "Admin" },
      ],
    },
    {
      id: "TRK-002",
      orderId: "ORD-2024-002",
      customerName: "XYZ Retail Ltd",
      deliveryAddress: "456 Market Road, Bangalore, KA 560001",
      estimatedDeliveryDate: new Date(now.getTime() + 5 * 86400000).toISOString(),
      currentStatus: "processing",
      remarks: "Handle with care",
      createdAt: new Date(now.getTime() - 86400000).toISOString(),
      lastUpdated: new Date(now.getTime() - 6 * 3600000).toISOString(),
      statusHistory: [
        { id: "h5", status: "order_confirmed", message: "Order has been confirmed", updatedAt: new Date(now.getTime() - 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h6", status: "processing", message: "Manufacturing in progress", updatedAt: new Date(now.getTime() - 6 * 3600000).toISOString(), updatedBy: "Admin" },
      ],
    },
    {
      id: "TRK-003",
      orderId: "ORD-2024-003",
      customerName: "GlobalMart Inc",
      deliveryAddress: "789 Industrial Area, Mumbai, MH 400001",
      estimatedDeliveryDate: new Date(now.getTime() - 86400000).toISOString(),
      currentStatus: "delivered",
      remarks: "",
      createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
      lastUpdated: new Date(now.getTime() - 86400000).toISOString(),
      statusHistory: [
        { id: "h7", status: "order_confirmed", message: "Order confirmed", updatedAt: new Date(now.getTime() - 7 * 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h8", status: "processing", message: "Processing started", updatedAt: new Date(now.getTime() - 6 * 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h9", status: "packed", message: "Packed", updatedAt: new Date(now.getTime() - 5 * 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h10", status: "shipped", message: "Shipped", updatedAt: new Date(now.getTime() - 3 * 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h11", status: "out_for_delivery", message: "Out for delivery", updatedAt: new Date(now.getTime() - 2 * 86400000).toISOString(), updatedBy: "Admin" },
        { id: "h12", status: "delivered", message: "Delivered successfully", updatedAt: new Date(now.getTime() - 86400000).toISOString(), updatedBy: "Admin" },
      ],
    },
  ];
  return seed;
};

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<TrackingRecord[]>(loadRecords);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const addRecord = (data: Omit<TrackingRecord, "id" | "statusHistory" | "currentStatus" | "createdAt" | "lastUpdated">) => {
    const now = new Date().toISOString();
    const newRecord: TrackingRecord = {
      ...data,
      id: `TRK-${String(records.length + 1).padStart(3, "0")}`,
      currentStatus: "order_confirmed",
      createdAt: now,
      lastUpdated: now,
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          status: "order_confirmed",
          message: "Order has been confirmed and tracking created",
          updatedAt: now,
          updatedBy: "System",
        },
      ],
    };
    setRecords((prev) => [...prev, newRecord]);
    return newRecord;
  };

  const updateStatus = (trackingId: string, status: DeliveryStatus, message: string, updatedBy: string, remarks?: string) => {
    const now = new Date().toISOString();
    setRecords((prev) =>
      prev.map((r) =>
        r.id === trackingId
          ? {
              ...r,
              currentStatus: status,
              lastUpdated: now,
              remarks: remarks ?? r.remarks,
              statusHistory: [
                ...r.statusHistory,
                { id: `sh-${Date.now()}`, status, message, updatedAt: now, updatedBy, remarks },
              ],
            }
          : r
      )
    );
  };

  const cancelDelivery = (trackingId: string, reason: string, updatedBy: string) => {
    updateStatus(trackingId, "cancelled", `Delivery cancelled: ${reason}`, updatedBy, reason);
  };

  const getRecord = (trackingId: string) => records.find((r) => r.id === trackingId);
  const getByOrderId = (orderId: string) => records.find((r) => r.orderId === orderId);

  return (
    <TrackingContext.Provider value={{ records, addRecord, updateStatus, cancelDelivery, getRecord, getByOrderId }}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error("useTracking must be used within TrackingProvider");
  return ctx;
}
