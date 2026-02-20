package com.starbag.logistics_Service.controller;

import com.starbag.logistics_Service.entity.DeliveryTracking;
import com.starbag.logistics_Service.entity.TrackingHistory;
import com.starbag.logistics_Service.service.DeliveryTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
@CrossOrigin
public class DeliveryTrackingController {

    private final DeliveryTrackingService service;

    // CREATE
    @PostMapping
    public DeliveryTracking create(@RequestBody DeliveryTracking tracking) {
        return service.createTracking(tracking);
    }

    // GET ALL
    @GetMapping
    public List<DeliveryTracking> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{trackingId}")
    public DeliveryTracking getByTrackingId(@PathVariable String trackingId) {
        return service.getByTrackingId(trackingId);
    }

    // UPDATE STATUS
    @PutMapping("/{trackingId}/status")
    public DeliveryTracking updateStatus(
            @PathVariable String trackingId,
            @RequestParam String status,
            @RequestParam String message) {

        return service.updateStatus(trackingId, status, message);
    }

    // DELETE
    @DeleteMapping("/{trackingId}")
    public void delete(@PathVariable String trackingId) {
        service.deleteTracking(trackingId);
    }

    // GET HISTORY
    @GetMapping("/{trackingId}/history")
    public List<TrackingHistory> getHistory(@PathVariable String trackingId) {
        return service.getHistory(trackingId);
    }
}
