package com.starbag.production.service.impl;

import com.starbag.production.domain.ProductionBatch;
import com.starbag.production.repository.ProductionRepository;
import com.starbag.production.service.ProductionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductionServiceImpl implements ProductionService {

    @Autowired
    private ProductionRepository repository;

    @Override
    public List<ProductionBatch> getAllBatches() {
        return repository.findAll();
    }

    @Override
    public ProductionBatch createBatch(ProductionBatch batch) {
        // Simple logic to generate ID if not provided: PB- + timestamp (or use UUID)
        if (batch.getId() == null || batch.getId().isEmpty()) {
            long count = repository.count() + 1;
            String generatedId = String.format("PB-%03d", count);
            batch.setId(generatedId);
        }
        return repository.save(batch);
    }

    @Override
    public ProductionBatch updateBatch(String id, ProductionBatch batchDetails) {
        return repository.findById(id).map(batch -> {
            batch.setProduct(batchDetails.getProduct());
            batch.setQuantity(batchDetails.getQuantity());
            batch.setStartDate(batchDetails.getStartDate());
            batch.setEndDate(batchDetails.getEndDate());
            batch.setStatus(batchDetails.getStatus());
            return repository.save(batch);
        }).orElseThrow(() -> new RuntimeException("Batch not found with id " + id));
    }

    @Override
    public void deleteBatch(String id) {
        repository.deleteById(id);
    }
}