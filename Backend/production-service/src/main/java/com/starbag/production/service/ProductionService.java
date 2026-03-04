package com.starbag.production.service;

import com.starbag.production.dto.ProductionBatchDto;
import java.util.List;

public interface ProductionService {

    List<ProductionBatchDto> getAllBatches();

    ProductionBatchDto createBatch(ProductionBatchDto batchDto);

    ProductionBatchDto updateBatch(String id, ProductionBatchDto batchDetails);

    void deleteBatch(String id);
}