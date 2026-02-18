package com.starbag.Supplier_Material_Management_Service.repository;
import com.starbag.Supplier_Material_Management_Service.domain.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
