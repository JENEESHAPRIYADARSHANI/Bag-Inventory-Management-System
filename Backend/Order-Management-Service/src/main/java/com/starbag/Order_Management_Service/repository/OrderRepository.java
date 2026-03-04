package com.starbag.Order_Management_Service.repository;

import com.starbag.Order_Management_Service.domain.Order;
import com.starbag.Order_Management_Service.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);
}