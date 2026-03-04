package com.starbag.production.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "production_batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionBatch {

    @Id
    @Column(length = 50)
    private String id;

    private String product;
    private Integer quantity;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    private String status; // "planned", "in_progress", "completed"
}