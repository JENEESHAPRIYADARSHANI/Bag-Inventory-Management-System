package com.starbag.logistics_Service.repository;

import com.starbag.logistics_Service.entity.DeliveryTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, Long> {

    Optional<DeliveryTracking> findByTrackingId(String trackingId);

    Optional<DeliveryTracking> findByOrderId(String orderId);
}
