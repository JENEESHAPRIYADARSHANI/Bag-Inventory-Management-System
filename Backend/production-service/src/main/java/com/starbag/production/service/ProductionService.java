package com.starbag.production.service;

import com.starbag.production.domain.ProductionBatch;
import java.util.List;

public interface ProductionService {

    List<ProductionBatch> getAllBatches();

    ProductionBatch createBatch(ProductionBatch batch);

    ProductionBatch updateBatch(String id, ProductionBatch batchDetails);

    void deleteBatch(String id);
}