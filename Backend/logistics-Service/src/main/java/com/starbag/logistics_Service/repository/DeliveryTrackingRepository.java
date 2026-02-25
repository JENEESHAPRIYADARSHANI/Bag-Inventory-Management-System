package com.starbag.logistics_Service.repository;

import com.starbag.logistics_Service.entity.DeliveryTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, Long> {

    Optional<DeliveryTracking> findByTrackingId(String trackingId);

    Optional<DeliveryTracking> findByOrderId(String orderId);

    List<DeliveryTracking> findByCurrentStatus(String status);

    List<DeliveryTracking> findByRecipientNameContainingIgnoreCase(String customerName);

    @Query("SELECT dt FROM DeliveryTracking dt WHERE dt.orderId LIKE %:search% OR dt.recipientName LIKE %:search% OR dt.trackingId LIKE %:search%")
    List<DeliveryTracking> searchByOrderIdOrCustomer(@Param("search") String search);

    @Query("SELECT dt FROM DeliveryTracking dt WHERE dt.updatedAt BETWEEN :startDate AND :endDate")
    List<DeliveryTracking> findByDateRange(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT dt FROM DeliveryTracking dt WHERE dt.currentStatus = :status AND dt.updatedAt BETWEEN :startDate AND :endDate")
    List<DeliveryTracking> findByStatusAndDateRange(@Param("status") String status,
            @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
