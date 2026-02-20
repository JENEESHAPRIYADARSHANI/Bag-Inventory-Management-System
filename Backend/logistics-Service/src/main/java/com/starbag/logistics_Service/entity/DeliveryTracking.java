package com.starbag.logistics_Service.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String trackingId;

    private String orderId;
    private String customerName;
    private String deliveryAddress;

    private LocalDateTime estimatedDeliveryDate;

    private String currentStatus;
    private LocalDateTime lastUpdated;

    @OneToMany(mappedBy = "deliveryTracking",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    @JsonManagedReference
    private List<TrackingHistory> historyList = new ArrayList<>();
}
