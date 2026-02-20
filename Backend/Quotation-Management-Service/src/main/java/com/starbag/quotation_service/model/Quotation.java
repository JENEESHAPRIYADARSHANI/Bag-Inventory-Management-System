package com.example.quotation_service.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "quotations")
public class Quotation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "contact_person")
    private String contactPerson;

    private String email;
    private String phone;
    private String status;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuotationItem> items = new ArrayList<>();
}
