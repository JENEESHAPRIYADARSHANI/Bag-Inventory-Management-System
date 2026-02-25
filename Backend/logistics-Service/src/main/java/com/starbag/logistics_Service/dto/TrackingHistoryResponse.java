package com.starbag.logistics_Service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackingHistoryResponse {
    private Long id;
    private String trackingId;
    private String orderId;
    private String customerName;
    private String status;
    private String message;
    private String location;
    private LocalDateTime updatedAt;
    private String updatedBy;
    private String remarks;
}
