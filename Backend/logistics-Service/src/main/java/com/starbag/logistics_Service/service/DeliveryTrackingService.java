package com.starbag.logistics_Service.service;

import com.starbag.logistics_Service.dto.*;
import com.starbag.logistics_Service.entity.DeliveryTracking;
import com.starbag.logistics_Service.entity.TrackingHistory;

import java.time.LocalDateTime;
import java.util.List;

public interface DeliveryTrackingService {

    // Admin Functions
    DeliveryTracking createTracking(DeliveryTracking tracking);

    DeliveryTracking createTrackingFromRequest(TrackingRequest request);

    List<DeliveryTracking> getAll();

    DeliveryTracking getByTrackingId(String trackingId);

    DeliveryTracking getByOrderId(String orderId);

    DeliveryTracking updateStatus(String trackingId, StatusUpdateRequest request);

    DeliveryTracking updateTracking(String trackingId, DeliveryTracking tracking);

    DeliveryTracking addNotes(String trackingId, String notes);

    DeliveryTracking cancelDelivery(String trackingId, String reason, String cancelledBy);

    void deleteTracking(String trackingId);

    // History & Timeline Functions
    List<TrackingHistory> getHistory(String trackingId);

    List<TrackingHistoryResponse> getHistoryWithDetails(String trackingId);

    List<TrackingHistoryResponse> getHistoryByStatus(String status);

    List<TrackingHistoryResponse> getHistoryByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<TrackingHistoryResponse> getHistoryByStatusAndDateRange(String status, LocalDateTime startDate,
            LocalDateTime endDate);

    // Search & Filter Functions
    List<DeliveryTracking> searchByOrderIdOrCustomer(String search);

    List<DeliveryTracking> filterByStatus(String status);

    List<DeliveryTracking> filterByDateRange(LocalDateTime startDate, LocalDateTime endDate);

    List<DeliveryTracking> filterByStatusAndDateRange(String status, LocalDateTime startDate, LocalDateTime endDate);

    // Customer Functions (Read-Only)
    List<TrackingResponse> getCustomerTrackings(String customerName);

    TrackingResponse getCustomerTrackingByOrderId(String orderId);

    List<TrackingHistory> getCustomerTrackingTimeline(String trackingId);
}
