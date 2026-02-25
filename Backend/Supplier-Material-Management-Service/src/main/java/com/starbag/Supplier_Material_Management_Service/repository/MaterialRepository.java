package com.starbag.Supplier_Material_Management_Service.repository;


import com.starbag.Supplier_Material_Management_Service.domain.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
}
