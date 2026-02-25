package com.starbag.logistics_Service.service.impl;

import com.starbag.logistics_Service.dto.*;
import com.starbag.logistics_Service.entity.DeliveryTracking;
import com.starbag.logistics_Service.entity.TrackingHistory;
import com.starbag.logistics_Service.repository.DeliveryTrackingRepository;
import com.starbag.logistics_Service.repository.TrackingHistoryRepository;
import com.starbag.logistics_Service.service.DeliveryTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliveryTrackingServiceImpl implements DeliveryTrackingService {

    private final DeliveryTrackingRepository trackingRepository;
    private final TrackingHistoryRepository historyRepository;

    @Override
    @Transactional
    public DeliveryTracking createTracking(DeliveryTracking tracking) {
        if (tracking.getTrackingId() == null || tracking.getTrackingId().isEmpty()) {
            tracking.setTrackingId(generateTrackingId());
        }

        if (tracking.getCurrentStatus() == null || tracking.getCurrentStatus().isEmpty()) {
            tracking.setCurrentStatus("ORDER_CONFIRMED");
        }

        DeliveryTracking savedTracking = trackingRepository.save(tracking);

        TrackingHistory initialHistory = new TrackingHistory();
        initialHistory.setDeliveryTracking(savedTracking);
        initialHistory.setStatus(savedTracking.getCurrentStatus());
        initialHistory.setLocation(tracking.getCurrentLocation());
        initialHistory.setMessage("Order confirmed and tracking created");
        initialHistory.setRemarks(tracking.getRemarks());
        historyRepository.save(initialHistory);

        return savedTracking;
    }

    @Override
    @Transactional
    public DeliveryTracking createTrackingFromRequest(TrackingRequest request) {
        DeliveryTracking tracking = new DeliveryTracking();
        tracking.setTrackingId(generateTrackingId());
        tracking.setOrderId(request.getOrderId());
        tracking.setRecipientName(request.getCustomerName());
        tracking.setDeliveryAddress(request.getDeliveryAddress());
        tracking.setRecipientPhone(request.getRecipientPhone());
        tracking.setCarrierName(request.getCarrierName());
        tracking.setEstimatedDeliveryDate(request.getEstimatedDeliveryDate());
        tracking.setCurrentStatus("ORDER_CONFIRMED");
        tracking.setRemarks(request.getRemarks());

        return createTracking(tracking);
    }

    @Override
    public List<DeliveryTracking> getAll() {
        return trackingRepository.findAll();
    }

    @Override
    public DeliveryTracking getByTrackingId(String trackingId) {
        return trackingRepository.findByTrackingId(trackingId)
                .orElseThrow(() -> new RuntimeException("Tracking not found: " + trackingId));
    }

    @Override
    public DeliveryTracking getByOrderId(String orderId) {
        return trackingRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Tracking not found for order: " + orderId));
    }

    @Override
    @Transactional
    public DeliveryTracking updateStatus(String trackingId, StatusUpdateRequest request) {
        DeliveryTracking tracking = getByTrackingId(trackingId);

        tracking.setCurrentStatus(request.getStatus());
        if (request.getLocation() != null) {
            tracking.setCurrentLocation(request.getLocation());
        }
        if (request.getRemarks() != null) {
            tracking.setRemarks(request.getRemarks());
        }

        DeliveryTracking updatedTracking = trackingRepository.save(tracking);

        TrackingHistory history = new TrackingHistory();
        history.setDeliveryTracking(updatedTracking);
        history.setStatus(request.getStatus());
        history.setLocation(request.getLocation());
        history.setMessage(request.getMessage());
        history.setUpdatedBy(request.getUpdatedBy());
        history.setRemarks(request.getRemarks());
        historyRepository.save(history);

        if ("DELIVERED".equalsIgnoreCase(request.getStatus())) {
            tracking.setActualDeliveryDate(LocalDateTime.now());
            trackingRepository.save(tracking);
        }

        return updatedTracking;
    }

    @Override
    @Transactional
    public DeliveryTracking updateTracking(String trackingId, DeliveryTracking tracking) {
        DeliveryTracking existing = getByTrackingId(trackingId);

        if (tracking.getCarrierName() != null)
            existing.setCarrierName(tracking.getCarrierName());
        if (tracking.getEstimatedDeliveryDate() != null)
            existing.setEstimatedDeliveryDate(tracking.getEstimatedDeliveryDate());
        if (tracking.getDeliveryAddress() != null)
            existing.setDeliveryAddress(tracking.getDeliveryAddress());
        if (tracking.getRecipientPhone() != null)
            existing.setRecipientPhone(tracking.getRecipientPhone());
        if (tracking.getRemarks() != null)
            existing.setRemarks(tracking.getRemarks());

        return trackingRepository.save(existing);
    }

    @Override
    @Transactional
    public DeliveryTracking addNotes(String trackingId, String notes) {
        DeliveryTracking tracking = getByTrackingId(trackingId);
        tracking.setRemarks(notes);
        return trackingRepository.save(tracking);
    }

    @Override
    @Transactional
    public DeliveryTracking cancelDelivery(String trackingId, String reason, String cancelledBy) {
        DeliveryTracking tracking = getByTrackingId(trackingId);

        tracking.setCurrentStatus("CANCELLED");
        tracking.setRemarks(reason);
        DeliveryTracking updatedTracking = trackingRepository.save(tracking);

        TrackingHistory history = new TrackingHistory();
        history.setDeliveryTracking(updatedTracking);
        history.setStatus("CANCELLED");
        history.setMessage("Delivery cancelled: " + reason);
        history.setUpdatedBy(cancelledBy);
        history.setRemarks(reason);
        historyRepository.save(history);

        return updatedTracking;
    }

    @Override
    @Transactional
    public void deleteTracking(String trackingId) {
        DeliveryTracking tracking = getByTrackingId(trackingId);
        trackingRepository.delete(tracking);
    }

    @Override
    public List<TrackingHistory> getHistory(String trackingId) {
        return historyRepository.findByDeliveryTracking_TrackingIdOrderByUpdatedAtAsc(trackingId);
    }

    @Override
    public List<TrackingHistoryResponse> getHistoryWithDetails(String trackingId) {
        DeliveryTracking tracking = getByTrackingId(trackingId);
        List<TrackingHistory> history = getHistory(trackingId);

        return history.stream().map(h -> {
            TrackingHistoryResponse response = new TrackingHistoryResponse();
            response.setId(h.getId());
            response.setTrackingId(trackingId);
            response.setOrderId(tracking.getOrderId());
            response.setCustomerName(tracking.getRecipientName());
            response.setStatus(h.getStatus());
            response.setMessage(h.getMessage());
            response.setLocation(h.getLocation());
            response.setUpdatedAt(h.getUpdatedAt());
            response.setUpdatedBy(h.getUpdatedBy());
            response.setRemarks(h.getRemarks());
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public List<TrackingHistoryResponse> getHistoryByStatus(String status) {
        List<TrackingHistory> history = historyRepository.findByStatusOrderByUpdatedAtDesc(status);
        return mapToHistoryResponse(history);
    }

    @Override
    public List<TrackingHistoryResponse> getHistoryByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<TrackingHistory> history = historyRepository.findByDateRange(startDate, endDate);
        return mapToHistoryResponse(history);
    }

    @Override
    public List<TrackingHistoryResponse> getHistoryByStatusAndDateRange(String status, LocalDateTime startDate,
            LocalDateTime endDate) {
        List<TrackingHistory> history = historyRepository.findByStatusAndDateRange(status, startDate, endDate);
        return mapToHistoryResponse(history);
    }

    @Override
    public List<DeliveryTracking> searchByOrderIdOrCustomer(String search) {
        return trackingRepository.searchByOrderIdOrCustomer(search);
    }

    @Override
    public List<DeliveryTracking> filterByStatus(String status) {
        return trackingRepository.findByCurrentStatus(status);
    }

    @Override
    public List<DeliveryTracking> filterByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return trackingRepository.findByDateRange(startDate, endDate);
    }

    @Override
    public List<DeliveryTracking> filterByStatusAndDateRange(String status, LocalDateTime startDate,
            LocalDateTime endDate) {
        return trackingRepository.findByStatusAndDateRange(status, startDate, endDate);
    }

    @Override
    public List<TrackingResponse> getCustomerTrackings(String customerName) {
        List<DeliveryTracking> trackings = trackingRepository.findByRecipientNameContainingIgnoreCase(customerName);
        return trackings.stream().map(this::mapToTrackingResponse).collect(Collectors.toList());
    }

    @Override
    public TrackingResponse getCustomerTrackingByOrderId(String orderId) {
        DeliveryTracking tracking = getByOrderId(orderId);
        return mapToTrackingResponse(tracking);
    }

    @Override
    public List<TrackingHistory> getCustomerTrackingTimeline(String trackingId) {
        return getHistory(trackingId);
    }

    private String generateTrackingId() {
        return "TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private TrackingResponse mapToTrackingResponse(DeliveryTracking tracking) {
        TrackingResponse response = new TrackingResponse();
        response.setTrackingId(tracking.getTrackingId());
        response.setOrderId(tracking.getOrderId());
        response.setCustomerName(tracking.getRecipientName());
        response.setDeliveryAddress(tracking.getDeliveryAddress());
        response.setCurrentStatus(tracking.getCurrentStatus());
        response.setEstimatedDeliveryDate(tracking.getEstimatedDeliveryDate());
        response.setActualDeliveryDate(tracking.getActualDeliveryDate());
        response.setLastUpdated(tracking.getUpdatedAt());
        response.setRemarks(tracking.getRemarks());
        response.setCarrierName(tracking.getCarrierName());
        return response;
    }

    private List<TrackingHistoryResponse> mapToHistoryResponse(List<TrackingHistory> historyList) {
        return historyList.stream().map(h -> {
            TrackingHistoryResponse response = new TrackingHistoryResponse();
            response.setId(h.getId());
            response.setTrackingId(h.getDeliveryTracking().getTrackingId());
            response.setOrderId(h.getDeliveryTracking().getOrderId());
            response.setCustomerName(h.getDeliveryTracking().getRecipientName());
            response.setStatus(h.getStatus());
            response.setMessage(h.getMessage());
            response.setLocation(h.getLocation());
            response.setUpdatedAt(h.getUpdatedAt());
            response.setUpdatedBy(h.getUpdatedBy());
            response.setRemarks(h.getRemarks());
            return response;
        }).collect(Collectors.toList());
    }
}
