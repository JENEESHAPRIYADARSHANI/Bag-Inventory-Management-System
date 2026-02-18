package com.starbag.inventory.service.impl;

import com.starbag.inventory.domain.Inventory;

import java.util.List;

public interface InventoryService {

    Inventory createInventory(Inventory inventory);

    List<Inventory> getAllInventory();

    Inventory getInventoryById(Long id);

}
