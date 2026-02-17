package com.starbag.Order_Management_Service.service.impl;

import com.starbag.Order_Management_Service.entity.Order;
import com.starbag.Order_Management_Service.enums.OrderStatus;
import com.starbag.Order_Management_Service.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // CREATE ORDER
    public Order createOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        return orderRepository.save(order);
    }

    // GET ALL ORDERS
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // GET ONE ORDER
    public Order getOrder(Long id) {
        return orderRepository.findById(id).orElseThrow();
    }

    // UPDATE STATUS (ADMIN)
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(status);
        return orderRepository.save(order);
    }

    // REQUEST CANCEL
    public Order requestCancel(Long id) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setStatus(OrderStatus.CANCEL_REQUESTED);
        return orderRepository.save(order);
    }
}
