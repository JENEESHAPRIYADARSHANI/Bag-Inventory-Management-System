package com.starbags.payment.dto;

import lombok.*;
import java.math.BigDecimal;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentSummaryResponse {
    private BigDecimal totalRevenue;
    private long completedCount;
    private long pendingCount;
    private long failedCount;
}
