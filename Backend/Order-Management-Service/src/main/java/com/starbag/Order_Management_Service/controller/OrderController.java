package com.starbag.Order_Management_Service.controller;

import com.starbag.Order_Management_Service.domain.Order;
import com.starbag.Order_Management_Service.domain.OrderStatus;
import com.starbag.Order_Management_Service.dto.OrderDto;
import com.starbag.Order_Management_Service.mapper.OrderMapper;
import com.starbag.Order_Management_Service.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:8080")
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public OrderController(OrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    @PostMapping
    public OrderDto create(@RequestBody OrderDto dto) {
        Order order = orderMapper.fromDto(dto);
        Order saved = orderService.createOrder(order);
        return orderMapper.toDto(saved);
    }

    @GetMapping
    public List<OrderDto> getAll() {
        return orderService.getAllOrders()
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public OrderDto getOne(@PathVariable Long id) {
        return orderMapper.toDto(orderService.getOrder(id));
    }

    @GetMapping("/customer/{customerId}")
    public List<OrderDto> getOrdersForCustomer(@PathVariable Long customerId) {
        return orderService.getOrdersForCustomer(customerId)
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    @PutMapping("/{id}")
    public OrderDto updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return orderMapper.toDto(orderService.updateStatus(id, status));
    }

    @PutMapping("/{id}/cancel")
    public OrderDto cancelByUser(@PathVariable Long id) {
        return orderMapper.toDto(orderService.cancelByUser(id));
    }

    @PutMapping("/{id}/admin-cancel")
    public OrderDto cancelByAdmin(@PathVariable Long id) {
        return orderMapper.toDto(orderService.cancelByAdmin(id));
    }
}