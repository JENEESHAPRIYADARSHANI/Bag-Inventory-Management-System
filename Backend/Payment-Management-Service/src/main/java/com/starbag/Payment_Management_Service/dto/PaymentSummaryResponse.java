package com.starbag.Payment_Management_Service.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentSummaryResponse {
    private BigDecimal totalRevenue;
    private long completedCount;
    private long pendingCount;
    private long failedCount;
}
