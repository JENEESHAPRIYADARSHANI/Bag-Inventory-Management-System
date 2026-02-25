package com.starbag.logistics_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingResponse {
    private String trackingId;
    private String orderId;
    private String customerName;
    private String deliveryAddress;
    private String currentStatus;
    private LocalDateTime estimatedDeliveryDate;
    private LocalDateTime actualDeliveryDate;
    private LocalDateTime lastUpdated;
    private String remarks;
    private String carrierName;
}
