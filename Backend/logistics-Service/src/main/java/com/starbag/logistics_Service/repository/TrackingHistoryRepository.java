package com.starbag.logistics_Service.repository;

import com.starbag.logistics_Service.entity.TrackingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TrackingHistoryRepository extends JpaRepository<TrackingHistory, Long> {

    List<TrackingHistory> findByDeliveryTracking_TrackingIdOrderByUpdatedAtAsc(String trackingId);

    List<TrackingHistory> findByStatusOrderByUpdatedAtDesc(String status);

    @Query("SELECT th FROM TrackingHistory th WHERE th.updatedAt BETWEEN :startDate AND :endDate ORDER BY th.updatedAt DESC")
    List<TrackingHistory> findByDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT th FROM TrackingHistory th WHERE th.status = :status AND th.updatedAt BETWEEN :startDate AND :endDate ORDER BY th.updatedAt DESC")
    List<TrackingHistory> findByStatusAndDateRange(@Param("status") String status,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
