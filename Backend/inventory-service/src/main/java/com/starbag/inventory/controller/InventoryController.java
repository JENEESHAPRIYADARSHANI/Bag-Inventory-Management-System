package com.starbag.inventory.controller;

import com.starbag.inventory.domain.Inventory;
import com.starbag.inventory.dto.InventoryDto;
import com.starbag.inventory.service.impl.InventoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // READ
    @GetMapping
    public List<Inventory> getInventory() {
        return inventoryService.getAllInventory();
    }

    // CREATE
    @PostMapping
    public Inventory createInventory(@RequestBody InventoryDto dto) {

        Inventory inventory = new Inventory();
        inventory.setProductId(dto.getProductId());
        inventory.setQuantityInStock(dto.getQuantityInStock());
        inventory.setReorderLevel(dto.getReorderLevel());

        return inventoryService.createInventory(inventory);
    }

    //UPDATE
    @PutMapping("/{id}")
    public Inventory updateInventory(
            @PathVariable Long id,
            @RequestBody InventoryDto dto) {

        Inventory existing = inventoryService.getInventoryById(id);

        existing.setQuantityInStock(dto.getQuantityInStock());
        existing.setReorderLevel(dto.getReorderLevel());

        return inventoryService.createInventory(existing);
    }

}
