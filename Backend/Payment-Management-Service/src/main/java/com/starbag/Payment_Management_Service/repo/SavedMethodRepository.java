package com.starbag.Payment_Management_Service.repo;

import com.starbag.Payment_Management_Service.entity.SavedPaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedMethodRepository extends JpaRepository<SavedPaymentMethod, Long> {
}
