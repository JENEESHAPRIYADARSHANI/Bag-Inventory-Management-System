package com.starbag.logistics_Service.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;
    private String message;
    private LocalDateTime updatedAt;
    private String updatedBy;

    @ManyToOne
    @JoinColumn(name = "delivery_tracking_id")
    @JsonBackReference
    private DeliveryTracking deliveryTracking;
}
