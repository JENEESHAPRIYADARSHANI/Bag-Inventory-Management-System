package com.starbags.payment.controller;

import com.starbags.payment.entity.SavedPaymentMethod;
import com.starbags.payment.entity.enums.MethodStatus;
import com.starbags.payment.service.SavedMethodService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
public class SavedMethodController {

    private final SavedMethodService service;

    // CREATE (Add Method)
    @PostMapping
    public SavedPaymentMethod add(@RequestBody SavedPaymentMethod req) {
        return service.add(req);
    }

    // READ (List Saved Methods)
    @GetMapping
    public List<SavedPaymentMethod> list() {
        return service.list();
    }

    // UPDATE (Edit Method)
    @PutMapping("/{id}")
    public SavedPaymentMethod update(@PathVariable Long id, @RequestBody SavedPaymentMethod req) {
        return service.update(id, req);
    }

    // PATCH Status (Activate/Disable)
    @PatchMapping("/{id}/status")
    public SavedPaymentMethod setStatus(@PathVariable Long id, @RequestParam MethodStatus status) {
        return service.setStatus(id, status);
    }

    // DELETE (Remove Method)
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
