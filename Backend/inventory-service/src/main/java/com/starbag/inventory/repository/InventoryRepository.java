package com.starbag.inventory.repository;

import com.starbag.inventory.domain.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

}
