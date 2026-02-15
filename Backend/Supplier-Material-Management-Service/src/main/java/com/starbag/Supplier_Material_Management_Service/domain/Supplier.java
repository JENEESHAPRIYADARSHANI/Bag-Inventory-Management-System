package com.starbag.Supplier_Material_Management_Service.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String address;

    // Status field will be added in the next commit
}