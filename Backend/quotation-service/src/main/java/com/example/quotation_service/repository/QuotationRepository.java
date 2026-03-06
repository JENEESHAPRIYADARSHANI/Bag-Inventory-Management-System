package com.example.quotation_service.repository;

import com.example.quotation_service.model.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    List<Quotation> findByEmail(String email);
    List<Quotation> findByStatus(String status);
}
