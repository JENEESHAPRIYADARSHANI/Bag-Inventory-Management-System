package com.starbag.logistics_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingRequest {
    private String orderId;
    private String customerName;
    private String deliveryAddress;
    private String recipientPhone;
    private String carrierName;
    private LocalDateTime estimatedDeliveryDate;
    private String remarks;
}
