package com.starbag.Supplier_Material_Management_Service.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.net.Inet4Address;
import java.util.Stack;

@Entity
@Table(name ="materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String unit;
    private Double unitPrice;
    private Integer reorderLevel;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status{
        ACTIVE, DISABLED
    }

}
