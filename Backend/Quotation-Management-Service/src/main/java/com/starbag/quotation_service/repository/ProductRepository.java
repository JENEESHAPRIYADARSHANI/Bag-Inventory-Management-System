package com.example.quotation_service.repository;

import com.example.quotation_service.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
