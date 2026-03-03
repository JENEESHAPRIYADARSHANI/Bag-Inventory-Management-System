package com.starbag.Payment_Management_Service.service;

import com.starbag.Payment_Management_Service.entity.SavedPaymentMethod;
import com.starbag.Payment_Management_Service.entity.enums.MethodStatus;
import com.starbag.Payment_Management_Service.exception.NotFoundException;
import com.starbag.Payment_Management_Service.repo.SavedMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedMethodService {

    private final SavedMethodRepository repo;

    public SavedPaymentMethod add(SavedPaymentMethod req) {
        return repo.save(req);
    }

    public List<SavedPaymentMethod> list() {
        return repo.findAll();
    }

    public SavedPaymentMethod update(Long id, SavedPaymentMethod req) {
        SavedPaymentMethod existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment method not found: " + id));

        existing.setCustomerName(req.getCustomerName());
        existing.setType(req.getType());
        existing.setCardHolderName(req.getCardHolderName());
        existing.setLast4(req.getLast4());
        existing.setExpiryMonth(req.getExpiryMonth());
        existing.setExpiryYear(req.getExpiryYear());
        existing.setBrand(req.getBrand());

        return repo.save(existing);
    }

    public SavedPaymentMethod setStatus(Long id, MethodStatus status) {
        SavedPaymentMethod existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment method not found: " + id));
        existing.setStatus(status);
        return repo.save(existing);
    }

    public void delete(Long id) {
        SavedPaymentMethod existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment method not found: " + id));
        repo.delete(existing);
    }
}
