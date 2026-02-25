package com.example.quotation_service.controller;

import com.example.quotation_service.dto.QuotationRequest;
import com.example.quotation_service.model.Quotation;
import com.example.quotation_service.service.QuotationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @PostMapping
    public ResponseEntity<Quotation> createQuotation(@RequestBody QuotationRequest request) {
        Quotation quotation = quotationService.createQuotation(request);
        return ResponseEntity.ok(quotation);
    }

    @GetMapping
    public List<Quotation> getAllQuotations() {
        return quotationService.getAllQuotations();
    }

    @GetMapping("/search")
    public List<Quotation> searchQuotations(@RequestParam String email) {
        return quotationService.getQuotationsByEmail(email);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quotation> getQuotation(@PathVariable Long id) {
        return quotationService.getQuotationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quotation> updateQuotation(@PathVariable Long id, @RequestBody Quotation quotation) {
        try {
            Quotation updated = quotationService.updateQuotation(id, quotation);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build(); // Or proper error message
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<Quotation> approveQuotation(@PathVariable Long id) {
        return ResponseEntity.ok(quotationService.approveQuotation(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<Void> rejectQuotation(@PathVariable Long id) {
        quotationService.rejectQuotation(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<Quotation> convertToOrder(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quotationService.convertToOrder(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
