package com.starbag.Order_Management_Service.controller;

import com.starbag.Order_Management_Service.entity.Order;
import com.starbag.Order_Management_Service.enums.OrderStatus;
import com.starbag.Order_Management_Service.service.impl.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // CREATE ORDER
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    // VIEW ALL ORDERS (ADMIN)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    // VIEW ONE ORDER
    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    // UPDATE STATUS
    @PutMapping("/{id}")
    public Order updateStatus(@PathVariable Long id,
                              @RequestParam OrderStatus status) {
        return orderService.updateStatus(id, status);
    }

    // REQUEST CANCEL
    @PutMapping("/{id}/cancel-request")
    public Order requestCancel(@PathVariable Long id) {
        return orderService.requestCancel(id);
    }
}
