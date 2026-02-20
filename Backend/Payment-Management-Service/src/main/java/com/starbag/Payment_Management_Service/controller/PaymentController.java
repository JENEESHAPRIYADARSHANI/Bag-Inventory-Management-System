package com.starbags.payment.controller;

import com.starbags.payment.dto.*;
import com.starbags.payment.entity.Payment;
import com.starbags.payment.entity.enums.PaymentMethod;
import com.starbags.payment.entity.enums.PaymentStatus;
import com.starbags.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    // CREATE (Record Payment)
    @PostMapping
    public Payment create(@Valid @RequestBody CreatePaymentRequest req) {
        return service.create(req);
    }

    // READ LIST (Payments Tab)
    @GetMapping
    public Page<Payment> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentMethod method,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort
    ) {
        return service.list(search, status, method, fromDate, toDate, page, size, sort);
    }

    // READ LIST (History Tab alias)
    @GetMapping("/history")
    public Page<Payment> history(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentMethod method,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.list(search, status, method, fromDate, toDate, page, size, "paymentDate,desc");
    }

    // READ ONE (View icon)
    @GetMapping("/{paymentId}")
    public Payment get(@PathVariable String paymentId) {
        return service.get(paymentId);
    }

    // UPDATE (Edit icon)
    @PutMapping("/{paymentId}")
    public Payment update(@PathVariable String paymentId, @Valid @RequestBody UpdatePaymentRequest req) {
        return service.update(paymentId, req);
    }

    // PATCH status (Pending -> Completed)
    @PatchMapping("/{paymentId}/status")
    public Payment updateStatus(@PathVariable String paymentId, @RequestParam PaymentStatus status) {
        return service.updateStatus(paymentId, status);
    }

    // VERIFY (History Verify button)
    @PostMapping("/{paymentId}/verify")
    public Payment verify(@PathVariable String paymentId) {
        return service.verify(paymentId);
    }

    // DELETE (Trash icon)
    @DeleteMapping("/{paymentId}")
    public void delete(@PathVariable String paymentId) {
        service.delete(paymentId);
    }

    // SUMMARY (Stat cards)
    @GetMapping("/summary")
    public PaymentSummaryResponse summary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate
    ) {
        return service.summary(fromDate, toDate);
    }
}
