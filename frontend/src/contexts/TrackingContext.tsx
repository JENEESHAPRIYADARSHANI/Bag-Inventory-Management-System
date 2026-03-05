import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  TrackingRecord,
  DeliveryStatus,
  StatusHistoryEntry,
} from "@/types/tracking";
import * as logisticsApi from "@/services/logisticsApi";

interface TrackingContextType {
  records: TrackingRecord[];
  loading: boolean;
  error: string | null;
  addRecord: (
    data: Omit<
      TrackingRecord,
      "id" | "statusHistory" | "currentStatus" | "createdAt" | "lastUpdated"
    >,
  ) => Promise<TrackingRecord>;
  updateStatus: (
    trackingId: string,
    status: DeliveryStatus,
    message: string,
    updatedBy: string,
    remarks?: string,
  ) => Promise<void>;
  cancelDelivery: (
    trackingId: string,
    reason: string,
    updatedBy: string,
  ) => Promise<void>;
  getRecord: (trackingId: string) => TrackingRecord | undefined;
  getByOrderId: (orderId: string) => TrackingRecord | undefined;
  refreshRecords: () => Promise<void>;
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined,
);

// Helper to convert backend response to frontend format
const mapBackendToFrontend = (
  backend: logisticsApi.DeliveryTrackingResponse,
): TrackingRecord => ({
  id: backend.trackingId,
  orderId: backend.orderId,
  customerName: backend.recipientName,
  deliveryAddress: backend.deliveryAddress,
  estimatedDeliveryDate: backend.estimatedDeliveryDate,
  currentStatus: backend.currentStatus as DeliveryStatus,
  statusHistory: [], // Will be populated separately if needed
  remarks: backend.remarks || "",
  createdAt: backend.createdAt,
  lastUpdated: backend.updatedAt,
});

export function TrackingProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<TrackingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logisticsApi.getAllTrackings();
      const mapped = data.map(mapBackendToFrontend);
      setRecords(mapped);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trackings",
      );
      console.error("Error fetching trackings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRecords();
  }, []);

  const addRecord = async (
    data: Omit<
      TrackingRecord,
      "id" | "statusHistory" | "currentStatus" | "createdAt" | "lastUpdated"
    >,
  ): Promise<TrackingRecord> => {
    try {
      const response = await logisticsApi.createTracking({
        orderId: data.orderId,
        customerName: data.customerName,
        deliveryAddress: data.deliveryAddress,
        recipientPhone: "", // Add phone field to your form if needed
        carrierName: "Default Carrier",
        estimatedDeliveryDate: data.estimatedDeliveryDate,
        remarks: data.remarks,
      });

      const newRecord = mapBackendToFrontend(response);
      setRecords((prev) => [...prev, newRecord]);
      return newRecord;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create tracking",
      );
      throw err;
    }
  };

  const updateStatus = async (
    trackingId: string,
    status: DeliveryStatus,
    message: string,
    updatedBy: string,
    remarks?: string,
  ): Promise<void> => {
    try {
      const response = await logisticsApi.updateTrackingStatus(trackingId, {
        status,
        message,
        updatedBy,
        remarks,
      });

      const updated = mapBackendToFrontend(response);
      setRecords((prev) =>
        prev.map((r) => (r.id === trackingId ? updated : r)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
      throw err;
    }
  };

  const cancelDelivery = async (
    trackingId: string,
    reason: string,
    updatedBy: string,
  ): Promise<void> => {
    try {
      const response = await logisticsApi.cancelDelivery(
        trackingId,
        reason,
        updatedBy,
      );
      const updated = mapBackendToFrontend(response);
      setRecords((prev) =>
        prev.map((r) => (r.id === trackingId ? updated : r)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to cancel delivery",
      );
      throw err;
    }
  };

  const getRecord = (trackingId: string) =>
    records.find((r) => r.id === trackingId);
  const getByOrderId = (orderId: string) =>
    records.find((r) => r.orderId === orderId);

  return (
    <TrackingContext.Provider
      value={{
        records,
        loading,
        error,
        addRecord,
        updateStatus,
        cancelDelivery,
        getRecord,
        getByOrderId,
        refreshRecords,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error("useTracking must be used within TrackingProvider");
  return ctx;
}
