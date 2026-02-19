package com.example.quotation_service.repository;

import com.example.quotation_service.model.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    List<Quotation> findByEmail(String email);
}
