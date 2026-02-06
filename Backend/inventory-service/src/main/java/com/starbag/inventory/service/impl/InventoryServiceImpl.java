package com.starbag.inventory.service.impl;

import com.starbag.inventory.domain.Inventory;
import com.starbag.inventory.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    // constructor injection
    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    // CREATE
    @Override
    public Inventory createInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    // READ
    @Override
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }
    //UPDATE
    @Override
    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id " + id));
    }

}
