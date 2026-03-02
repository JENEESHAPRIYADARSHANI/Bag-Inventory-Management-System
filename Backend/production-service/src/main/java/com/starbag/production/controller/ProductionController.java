package com.starbag.production.controller;

import com.starbag.production.dto.ProductionBatchDto;
import com.starbag.production.service.ProductionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/production")
public class ProductionController {

    @Autowired
    private ProductionService service;

    @GetMapping
    public ResponseEntity<List<ProductionBatchDto>> getAllBatches() {
        List<ProductionBatchDto> batches = service.getAllBatches();
        return ResponseEntity.ok(batches); // Returns 200 OK
    }

    @PostMapping
    public ResponseEntity<ProductionBatchDto> createBatch(@RequestBody ProductionBatchDto batchDto) {
        ProductionBatchDto createdBatch = service.createBatch(batchDto);
        return new ResponseEntity<>(createdBatch, HttpStatus.CREATED); // Returns 201 Created
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductionBatchDto> updateBatch(@PathVariable String id, @RequestBody ProductionBatchDto batchDto) {
        ProductionBatchDto updatedBatch = service.updateBatch(id, batchDto);
        return ResponseEntity.ok(updatedBatch); // Returns 200 OK
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable String id) {
        service.deleteBatch(id);
        return ResponseEntity.noContent().build(); // Returns 204 No Content
    }
}