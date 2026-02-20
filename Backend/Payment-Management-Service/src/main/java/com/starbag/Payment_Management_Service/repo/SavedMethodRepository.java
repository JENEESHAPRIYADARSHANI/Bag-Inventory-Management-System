package com.starbags.payment.repo;

import com.starbags.payment.entity.SavedPaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedMethodRepository extends JpaRepository<SavedPaymentMethod, Long> {
}
