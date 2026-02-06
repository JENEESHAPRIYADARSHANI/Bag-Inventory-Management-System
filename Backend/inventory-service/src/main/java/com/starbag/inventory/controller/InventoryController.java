package com.starbag.inventory.controller;

import com.starbag.inventory.domain.Inventory;
import com.starbag.inventory.service.impl.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    // Constructor injection
    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // READ - get all inventory
    @GetMapping
    public List<Inventory> getInventory() {
        return inventoryService.getAllInventory();
    }

    // CREATE - create inventory
    @PostMapping
    public Inventory createInventory(@RequestBody Inventory inventory) {
        return inventoryService.createInventory(inventory);
    }
}
