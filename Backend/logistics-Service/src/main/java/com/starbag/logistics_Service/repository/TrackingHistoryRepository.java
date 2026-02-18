package com.starbag.logistics_Service.repository;

import com.starbag.logistics_Service.entity.TrackingHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingHistoryRepository extends JpaRepository<TrackingHistory, Long> {

    List<TrackingHistory> findByDeliveryTracking_TrackingIdOrderByUpdatedAtAsc(String trackingId);
}
