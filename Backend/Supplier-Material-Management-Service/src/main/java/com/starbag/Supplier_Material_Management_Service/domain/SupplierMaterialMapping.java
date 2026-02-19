package com.starbag.Supplier_Material_Management_Service.domain;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "supplier_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierMaterialMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private Material material;

    private Double supplyPrice;
    private Integer leadTimeDays;
}
