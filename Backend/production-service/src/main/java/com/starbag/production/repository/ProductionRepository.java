package com.starbag.production.repository;

import com.starbag.production.domain.ProductionBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductionRepository extends JpaRepository<ProductionBatch, String> {
    // You can add custom queries here if needed, but standard CRUD is included.
}