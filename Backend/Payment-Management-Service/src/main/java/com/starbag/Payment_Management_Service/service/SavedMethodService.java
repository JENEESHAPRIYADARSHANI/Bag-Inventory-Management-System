package com.starbag.Payment_Management_Service.service;

import com.starbag.Payment_Management_Service.entity.SavedPaymentMethod;
import com.starbag.Payment_Management_Service.entity.enums.MethodStatus;
import com.starbag.Payment_Management_Service.exception.NotFoundException;
import com.starbag.Payment_Management_Service.repo.SavedMethodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SavedMethodService {

    private final SavedMethodRepository repo;
    
    @Autowired(required = false)
    private KmsEncryptionService kmsEncryptionService;

    public SavedMethodService(SavedMethodRepository repo) {
        this.repo = repo;
    }

    public SavedPaymentMethod add(SavedPaymentMethod req) {
        // Only encrypt if KMS service is available
        if (kmsEncryptionService != null && req.getLast4() != null && !req.getLast4().isEmpty()) {
            try {
                req.setLast4(kmsEncryptionService.encryptLast4(req.getLast4()));
            } catch (Exception e) {
                System.err.println("Warning: Encryption failed, storing unencrypted: " + e.getMessage());
            }
        }
        return repo.save(req);
    }

    public List<SavedPaymentMethod> list() {
        List<SavedPaymentMethod> methods = repo.findAll();
        // Only decrypt if KMS service is available
        if (kmsEncryptionService != null) {
            methods.forEach(method -> {
                if (method.getLast4() != null && !method.getLast4().isEmpty()) {
                    try {
                        method.setLast4(kmsEncryptionService.decryptLast4(method.getLast4()));
                    } catch (Exception e) {
                        if (method.getLast4().length() > 4) {
                            method.setLast4("****");
                        }
                    }
                }
            });
        }
        return methods;
    }

    public SavedPaymentMethod update(Long id, SavedPaymentMethod req) {
        SavedPaymentMethod existing = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Payment method not found: " + id));

        existing.setCustomerName(req.getCustomerName());
        existing.setType(req.getType());
        existing.setCardHolderName(req.getCardHolderName());
        
        // Only encrypt if KMS service is available
        if (req.getLast4() != null && !req.getLast4().isEmpty()) {
            if (kmsEncryptionService != null) {
                try {
                    existing.setLast4(kmsEncryptionService.encryptLast4(req.getLast4()));
                } catch (Exception e) {
                    existing.setLast4(req.getLast4());
                    System.err.println("Warning: Encryption failed, storing unencrypted: " + e.getMessage());
                }
            } else {
                existing.setLast4(req.getLast4());
            }
        }
        
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
