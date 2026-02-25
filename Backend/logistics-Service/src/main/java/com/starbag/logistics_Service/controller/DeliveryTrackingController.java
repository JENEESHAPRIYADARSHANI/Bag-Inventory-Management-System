package com.starbag.logistics_Service.controller;

import com.starbag.logistics_Service.dto.*;
import com.starbag.logistics_Service.entity.DeliveryTracking;
import com.starbag.logistics_Service.entity.TrackingHistory;
import com.starbag.logistics_Service.service.DeliveryTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@CrossOrigin
public class DeliveryTrackingController {

    private final DeliveryTrackingService service;

    // ========== ADMIN ENDPOINTS ==========

    // Create tracking from order confirmation
    @PostMapping
    public ResponseEntity<DeliveryTracking> createTracking(@RequestBody DeliveryTracking tracking) {
        return ResponseEntity.ok(service.createTracking(tracking));
    }

    @PostMapping("/create")
    public ResponseEntity<DeliveryTracking> createTrackingFromRequest(@RequestBody TrackingRequest request) {
        return ResponseEntity.ok(service.createTrackingFromRequest(request));
    }

    // View all trackings
    @GetMapping
    public ResponseEntity<List<DeliveryTracking>> getAllTrackings() {
        return ResponseEntity.ok(service.getAll());
    }

    // View tracking details
    @GetMapping("/{trackingId}")
    public ResponseEntity<DeliveryTracking> getTrackingById(@PathVariable String trackingId) {
        return ResponseEntity.ok(service.getByTrackingId(trackingId));
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<DeliveryTracking> getTrackingByOrderId(@PathVariable String orderId) {
        return ResponseEntity.ok(service.getByOrderId(orderId));
    }

    // Update delivery status
    @PutMapping("/{trackingId}/status")
    public ResponseEntity<DeliveryTracking> updateStatus(
            @PathVariable String trackingId,
            @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(service.updateStatus(trackingId, request));
    }

    // Update tracking details
    @PutMapping("/{trackingId}")
    public ResponseEntity<DeliveryTracking> updateTracking(
            @PathVariable String trackingId,
            @RequestBody DeliveryTracking tracking) {
        return ResponseEntity.ok(service.updateTracking(trackingId, tracking));
    }

    // Add notes/remarks
    @PutMapping("/{trackingId}/notes")
    public ResponseEntity<DeliveryTracking> addNotes(
            @PathVariable String trackingId,
            @RequestParam String notes) {
        return ResponseEntity.ok(service.addNotes(trackingId, notes));
    }

    // Cancel delivery
    @PutMapping("/{trackingId}/cancel")
    public ResponseEntity<DeliveryTracking> cancelDelivery(
            @PathVariable String trackingId,
            @RequestParam String reason,
            @RequestParam String cancelledBy) {
        return ResponseEntity.ok(service.cancelDelivery(trackingId, reason, cancelledBy));
    }

    // Delete tracking
    @DeleteMapping("/{trackingId}")
    public ResponseEntity<Void> deleteTracking(@PathVariable String trackingId) {
        service.deleteTracking(trackingId);
        return ResponseEntity.noContent().build();
    }

    // ========== HISTORY & TIMELINE ENDPOINTS ==========

    // Get tracking history
    @GetMapping("/{trackingId}/history")
    public ResponseEntity<List<TrackingHistory>> getHistory(@PathVariable String trackingId) {
        return ResponseEntity.ok(service.getHistory(trackingId));
    }

    // Get detailed history with customer info
    @GetMapping("/{trackingId}/history/details")
    public ResponseEntity<List<TrackingHistoryResponse>> getHistoryWithDetails(@PathVariable String trackingId) {
        return ResponseEntity.ok(service.getHistoryWithDetails(trackingId));
    }

    // Filter history by status
    @GetMapping("/history/status/{status}")
    public ResponseEntity<List<TrackingHistoryResponse>> getHistoryByStatus(@PathVariable String status) {
        return ResponseEntity.ok(service.getHistoryByStatus(status));
    }

    // Filter history by date range
    @GetMapping("/history/date-range")
    public ResponseEntity<List<TrackingHistoryResponse>> getHistoryByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(service.getHistoryByDateRange(startDate, endDate));
    }

    // Filter history by status and date range
    @GetMapping("/history/filter")
    public ResponseEntity<List<TrackingHistoryResponse>> getHistoryByStatusAndDateRange(
            @RequestParam String status,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(service.getHistoryByStatusAndDateRange(status, startDate, endDate));
    }

    // ========== SEARCH & FILTER ENDPOINTS ==========

    // Search by order ID or customer name
    @GetMapping("/search")
    public ResponseEntity<List<DeliveryTracking>> searchTrackings(@RequestParam String query) {
        return ResponseEntity.ok(service.searchByOrderIdOrCustomer(query));
    }

    // Filter by status
    @GetMapping("/filter/status/{status}")
    public ResponseEntity<List<DeliveryTracking>> filterByStatus(@PathVariable String status) {
        return ResponseEntity.ok(service.filterByStatus(status));
    }

    // Filter by date range
    @GetMapping("/filter/date-range")
    public ResponseEntity<List<DeliveryTracking>> filterByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(service.filterByDateRange(startDate, endDate));
    }

    // Filter by status and date range
    @GetMapping("/filter")
    public ResponseEntity<List<DeliveryTracking>> filterByStatusAndDateRange(
            @RequestParam String status,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(service.filterByStatusAndDateRange(status, startDate, endDate));
    }

    // ========== CUSTOMER READ-ONLY ENDPOINTS ==========

    // Get customer's trackings
    @GetMapping("/customer/{customerName}")
    public ResponseEntity<List<TrackingResponse>> getCustomerTrackings(@PathVariable String customerName) {
        return ResponseEntity.ok(service.getCustomerTrackings(customerName));
    }

    // Get customer tracking by order ID
    @GetMapping("/customer/order/{orderId}")
    public ResponseEntity<TrackingResponse> getCustomerTrackingByOrderId(@PathVariable String orderId) {
        return ResponseEntity.ok(service.getCustomerTrackingByOrderId(orderId));
    }

    // Get customer tracking timeline
    @GetMapping("/customer/timeline/{trackingId}")
    public ResponseEntity<List<TrackingHistory>> getCustomerTrackingTimeline(@PathVariable String trackingId) {
        return ResponseEntity.ok(service.getCustomerTrackingTimeline(trackingId));
    }
}
