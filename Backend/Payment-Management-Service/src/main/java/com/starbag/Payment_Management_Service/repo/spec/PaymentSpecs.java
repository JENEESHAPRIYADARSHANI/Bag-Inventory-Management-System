package com.starbags.payment.repo.spec;

import com.starbags.payment.entity.Payment;
import com.starbags.payment.entity.enums.PaymentMethod;
import com.starbags.payment.entity.enums.PaymentStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class PaymentSpecs {

    public static Specification<Payment> search(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank()) return cb.conjunction();
            String like = "%" + q.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("paymentId")), like),
                    cb.like(cb.lower(root.get("orderId")), like),
                    cb.like(cb.lower(root.get("customerName")), like),
                    cb.like(cb.lower(root.get("txnRef")), like)
            );
        };
    }

    public static Specification<Payment> status(PaymentStatus status) {
        return (root, query, cb) -> status == null ? cb.conjunction() : cb.equal(root.get("status"), status);
    }

    public static Specification<Payment> method(PaymentMethod method) {
        return (root, query, cb) -> method == null ? cb.conjunction() : cb.equal(root.get("method"), method);
    }

    public static Specification<Payment> dateBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return cb.conjunction();
            if (from != null && to != null) return cb.between(root.get("paymentDate"), from, to);
            if (from != null) return cb.greaterThanOrEqualTo(root.get("paymentDate"), from);
            return cb.lessThanOrEqualTo(root.get("paymentDate"), to);
        };
    }
}
