package com.starbag.inventory.service.impl;

import com.starbag.inventory.client.ProductServiceClient;
import com.starbag.inventory.domain.Inventory;
import com.starbag.inventory.repository.InventoryRepository;
import com.starbag.inventory.service.InventoryService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductServiceClient productServiceClient;

    public InventoryServiceImpl(InventoryRepository inventoryRepository,
                                ProductServiceClient productServiceClient) {
        this.inventoryRepository = inventoryRepository;
        this.productServiceClient = productServiceClient;
    }

    // CREATE
    @Override
    public Inventory createInventory(Inventory inventory) {

        boolean productExists =
                productServiceClient.productExists(inventory.getProductId());

        if (!productExists) {
            throw new RuntimeException(
                    "Product does not exist in Product Catalog Service");
        }

        return inventoryRepository.save(inventory);
    }

    // READ
    @Override
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Inventory not found with id " + id));
    }

    // DELETE
    @Override
    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }

}