package com.starbags.payment.repo;

import com.starbags.payment.entity.Payment;
import com.starbags.payment.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, String>, JpaSpecificationExecutor<Payment> {

    Optional<Payment> findTopByOrderByCreatedAtDesc();

    @Query("""
           select coalesce(sum(p.amount), 0)
           from Payment p
           where p.status = com.starbags.payment.entity.enums.PaymentStatus.COMPLETED
           and (:from is null or p.paymentDate >= :from)
           and (:to is null or p.paymentDate <= :to)
           """)
    BigDecimal totalRevenue(@Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("""
           select count(p)
           from Payment p
           where p.status = :status
           and (:from is null or p.paymentDate >= :from)
           and (:to is null or p.paymentDate <= :to)
           """)
    long countByStatusAndDate(@Param("status") PaymentStatus status,
                              @Param("from") LocalDate from,
                              @Param("to") LocalDate to);
}
