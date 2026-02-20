package com.starbag.Order_Management_Service.repository;

import com.starbag.Order_Management_Service.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
