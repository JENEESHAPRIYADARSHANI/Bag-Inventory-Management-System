package com.example.quotation_service.controller;

import com.example.quotation_service.dto.ProductDto;
import com.example.quotation_service.dto.QuotationRequest;
import com.example.quotation_service.dto.QuotationUpdateRequest;
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

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getProductsFromService() {
        return ResponseEntity.ok(quotationService.getProducts());
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

    @PutMapping("/{id}/send")
    public ResponseEntity<Quotation> updateAndSendQuotation(@PathVariable Long id,
            @RequestBody QuotationUpdateRequest request) {
        try {
            Quotation updated = quotationService.updateAndSendQuotation(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quotation> updateQuotation(@PathVariable Long id,
            @RequestBody QuotationUpdateRequest request) {
        try {
            Quotation updated = quotationService.updateQuotation(id, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Quotation> acceptQuotation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quotationService.acceptQuotation(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/convert")
    public ResponseEntity<Quotation> convertToOrder(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quotationService.convertToOrder(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Quotation> rejectQuotation(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quotationService.rejectQuotation(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuotation(@PathVariable Long id) {
        try {
            quotationService.deleteQuotation(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
