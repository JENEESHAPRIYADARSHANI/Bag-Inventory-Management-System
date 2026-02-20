package com.starbags.payment.service;

import com.starbags.payment.dto.*;
import com.starbags.payment.entity.Payment;
import com.starbags.payment.entity.enums.PaymentMethod;
import com.starbags.payment.entity.enums.PaymentStatus;
import com.starbags.payment.exception.NotFoundException;
import com.starbags.payment.repo.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

import static com.starbags.payment.repo.spec.PaymentSpecs.*;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepo;

    // CREATE
    public Payment create(CreatePaymentRequest req) {
        String nextId = generateNextPaymentId();

        Payment p = Payment.builder()
                .paymentId(nextId)
                .orderId(req.getOrderId())
                .customerName(req.getCustomerName())
                .amount(req.getAmount())
                .method(req.getMethod())
                .status(req.getStatus())
                .paymentDate(req.getPaymentDate())
                .txnRef(req.getTxnRef())
                .verified(false)
                .build();

        return paymentRepo.save(p);
    }

    // READ LIST (Payments tab + History tab)
    public Page<Payment> list(String q, PaymentStatus status, PaymentMethod method,
                             LocalDate from, LocalDate to,
                             int page, int size, String sort) {

        Sort s = Sort.by("createdAt").descending();
        if (sort != null && !sort.isBlank()) {
            String[] parts = sort.split(",");
            if (parts.length == 2) {
                s = Sort.by(Sort.Direction.fromString(parts[1]), parts[0]);
            }
        }

        Pageable pageable = PageRequest.of(page, size, s);

        Specification<Payment> spec = Specification.where(search(q))
                .and(status(status))
                .and(method(method))
                .and(dateBetween(from, to));

        return paymentRepo.findAll(spec, pageable);
    }

    // READ ONE
    public Payment get(String paymentId) {
        return paymentRepo.findById(paymentId)
                .orElseThrow(() -> new NotFoundException("Payment not found: " + paymentId));
    }

    // UPDATE
    public Payment update(String paymentId, UpdatePaymentRequest req) {
        Payment p = get(paymentId);

        p.setOrderId(req.getOrderId());
        p.setCustomerName(req.getCustomerName());
        p.setAmount(req.getAmount());
        p.setMethod(req.getMethod());
        p.setStatus(req.getStatus());
        p.setPaymentDate(req.getPaymentDate());
        p.setTxnRef(req.getTxnRef());

        if (req.getVerified() != null) {
            p.setVerified(req.getVerified());
            p.setVerifiedAt(req.getVerified() ? java.time.LocalDateTime.now() : null);
        }

        return paymentRepo.save(p);
    }

    // UPDATE STATUS (Pending -> Completed)
    public Payment updateStatus(String paymentId, PaymentStatus status) {
        Payment p = get(paymentId);
        p.setStatus(status);
        return paymentRepo.save(p);
    }

    // VERIFY (History tab Verify button)
    public Payment verify(String paymentId) {
        Payment p = get(paymentId);
        p.setVerified(true);
        p.setVerifiedAt(java.time.LocalDateTime.now());
        return paymentRepo.save(p);
    }

    // DELETE
    public void delete(String paymentId) {
        Payment p = get(paymentId);
        paymentRepo.delete(p);
    }

    // SUMMARY (stat cards)
    public PaymentSummaryResponse summary(LocalDate from, LocalDate to) {
        BigDecimal revenue = paymentRepo.totalRevenue(from, to);
        long completed = paymentRepo.countByStatusAndDate(PaymentStatus.COMPLETED, from, to);
        long pending = paymentRepo.countByStatusAndDate(PaymentStatus.PENDING, from, to);
        long failed = paymentRepo.countByStatusAndDate(PaymentStatus.FAILED, from, to);

        return PaymentSummaryResponse.builder()
                .totalRevenue(revenue)
                .completedCount(completed)
                .pendingCount(pending)
                .failedCount(failed)
                .build();
    }

    // Generate PAY-001, PAY-002...
    private String generateNextPaymentId() {
        return paymentRepo.findTopByOrderByCreatedAtDesc()
                .map(last -> {
                    String id = last.getPaymentId(); // PAY-001
                    int num = Integer.parseInt(id.replace("PAY-", ""));
                    return String.format("PAY-%03d", num + 1);
                })
                .orElse("PAY-001");
    }
}
