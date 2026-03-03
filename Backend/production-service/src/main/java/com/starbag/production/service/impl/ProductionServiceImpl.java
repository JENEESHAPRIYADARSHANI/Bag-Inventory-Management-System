package com.starbag.production.service.impl;

import com.starbag.production.domain.ProductionBatch;
import com.starbag.production.dto.ProductionBatchDto;
import com.starbag.production.exception.ResourceNotFoundException;
import com.starbag.production.repository.ProductionRepository;
import com.starbag.production.service.ProductionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductionServiceImpl implements ProductionService {

    @Autowired
    private ProductionRepository repository;

    @Override
    public List<ProductionBatchDto> getAllBatches() {
        // Fetch all raw entities, convert them to DTOs, and return the list
        return repository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductionBatchDto createBatch(ProductionBatchDto batchDto) {
        // 1. Convert the incoming DTO into a raw Entity for the database
        ProductionBatch batch = mapToEntity(batchDto);

        // 2. Generate ID if not provided
        if (batch.getId() == null || batch.getId().isEmpty()) {
            long count = repository.count() + 1;
            String generatedId = String.format("PB-%03d", count);
            batch.setId(generatedId);
        }

        // 3. Save to database
        ProductionBatch savedBatch = repository.save(batch);

        // 4. Convert the saved entity back to a secure DTO to return
        return mapToDto(savedBatch);
    }

    @Override
    public ProductionBatchDto updateBatch(String id, ProductionBatchDto batchDetails) {
        // Use your custom exception if the ID isn't found!
        ProductionBatch batch = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with id: " + id));

        // Update the fields
        batch.setProduct(batchDetails.getProduct());
        batch.setQuantity(batchDetails.getQuantity());
        batch.setStartDate(batchDetails.getStartDate());
        batch.setEndDate(batchDetails.getEndDate());
        batch.setStatus(batchDetails.getStatus());

        ProductionBatch updatedBatch = repository.save(batch);
        return mapToDto(updatedBatch);
    }

    @Override
    public void deleteBatch(String id) {
        // Check if it exists before deleting, throw custom exception if it doesn't
        ProductionBatch batch = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with id: " + id));

        repository.delete(batch);
    }

    // ==========================================
    // HELPER METHODS: The "Translators"
    // ==========================================

    private ProductionBatchDto mapToDto(ProductionBatch batch) {
        return new ProductionBatchDto(
                batch.getId(),
                batch.getProduct(),
                batch.getQuantity(),
                batch.getStartDate(),
                batch.getEndDate(),
                batch.getStatus()
        );
    }

    private ProductionBatch mapToEntity(ProductionBatchDto dto) {
        ProductionBatch batch = new ProductionBatch();
        batch.setId(dto.getId());
        batch.setProduct(dto.getProduct());
        batch.setQuantity(dto.getQuantity());
        batch.setStartDate(dto.getStartDate());
        batch.setEndDate(dto.getEndDate());
        batch.setStatus(dto.getStatus());
        return batch;
    }
}