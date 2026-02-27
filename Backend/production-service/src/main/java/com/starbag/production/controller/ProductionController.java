package com.starbag.production.controller;

import com.starbag.production.domain.ProductionBatch;
import com.starbag.production.service.ProductionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production")
@CrossOrigin(origins = "*") // Connects to your React Frontend
public class ProductionController {

    @Autowired
    private ProductionService service;

    @GetMapping
    public List<ProductionBatch> getAllBatches() {
        return service.getAllBatches();
    }

    @PostMapping
    public ProductionBatch createBatch(@RequestBody ProductionBatch batch) {
        return service.createBatch(batch);
    }

    @PutMapping("/{id}")
    public ProductionBatch updateBatch(@PathVariable String id, @RequestBody ProductionBatch batch) {
        return service.updateBatch(id, batch);
    }

    @DeleteMapping("/{id}")
    public void deleteBatch(@PathVariable String id) {
        service.deleteBatch(id);
    }
}