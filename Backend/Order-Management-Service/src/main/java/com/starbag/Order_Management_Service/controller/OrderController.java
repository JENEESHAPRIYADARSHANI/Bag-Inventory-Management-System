package com.starbag.Order_Management_Service.controller;

import com.starbag.Order_Management_Service.domain.Order;
import com.starbag.Order_Management_Service.domain.OrderStatus;
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

    // VIEW ALL ORDERS (Admin) + FILTER BY STATUS
    // GET /orders  OR  GET /orders?status=PENDING
    @GetMapping
    public List<Order> getOrders(@RequestParam(required = false) OrderStatus status) {
        if (status == null) {
            return orderService.getAllOrders();
        }
        return orderService.getOrdersByStatus(status);
    }

    // VIEW ONE ORDER
    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderService.getOrder(id);
    }

    // UPDATE STATUS (Admin)
    // Example: PUT /orders/1?status=CONFIRMED
    @PutMapping("/{id}")
    public Order updateStatus(@PathVariable Long id,
                              @RequestParam OrderStatus status) {
        return orderService.updateStatus(id, status);
    }

    // USER REQUEST CANCEL
    @PutMapping("/{id}/cancel-request")
    public Order requestCancel(@PathVariable Long id) {
        return orderService.requestCancel(id);
    }

    // ADMIN APPROVE CANCELLATION
    @PutMapping("/{id}/cancel-approve")
    public Order approveCancel(@PathVariable Long id) {
        return orderService.approveCancellation(id);
    }

    // ADMIN REJECT CANCELLATION
    @PutMapping("/{id}/cancel-reject")
    public Order rejectCancel(@PathVariable Long id) {
        return orderService.rejectCancellation(id);
    }
}