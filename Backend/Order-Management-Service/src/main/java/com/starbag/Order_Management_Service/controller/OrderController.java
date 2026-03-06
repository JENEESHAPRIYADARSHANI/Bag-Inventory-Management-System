package com.starbag.Order_Management_Service.controller;

import com.starbag.Order_Management_Service.domain.Order;
import com.starbag.Order_Management_Service.domain.OrderStatus;
import com.starbag.Order_Management_Service.dto.OrderDto;
import com.starbag.Order_Management_Service.mapper.OrderMapper;
import com.starbag.Order_Management_Service.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders") // ✅ OLD format (no /api/v1)
@CrossOrigin(origins = "*") // ✅ helpful during local dev (optional)
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    public OrderController(OrderService orderService, OrderMapper orderMapper) {
        this.orderService = orderService;
        this.orderMapper = orderMapper;
    }

    // ✅ CREATE (user checkout)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto create(@RequestBody OrderDto dto) {
        Order order = orderMapper.fromDto(dto);
        Order saved = orderService.createOrder(order);
        return orderMapper.toDto(saved);
    }

    // ✅ ADMIN: GET ALL
    @GetMapping
    public List<OrderDto> getAll() {
        return orderService.getAllOrders().stream().map(orderMapper::toDto).toList();
    }

    // ✅ GET ONE
    @GetMapping("/{id}")
    public OrderDto getOne(@PathVariable Long id) {
        return orderMapper.toDto(orderService.getOrder(id));
    }

    // ✅ USER: GET BY CUSTOMER
    @GetMapping("/customer/{customerId}")
    public List<OrderDto> getOrdersForCustomer(@PathVariable Long customerId) {
        return orderService.getOrdersForCustomer(customerId).stream().map(orderMapper::toDto).toList();
    }

    // ✅ ADMIN: UPDATE STATUS
    @PutMapping("/{id}")
    public OrderDto updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return orderMapper.toDto(orderService.updateStatus(id, status));
    }

    // ✅ USER: CANCEL REQUEST
    @PutMapping("/{id}/cancel-request")
    public OrderDto cancelRequest(@PathVariable Long id) {
        return orderMapper.toDto(orderService.requestCancel(id));
    }

    // ✅ ADMIN: CANCEL APPROVE
    @PutMapping("/{id}/cancel-approve")
    public OrderDto cancelApprove(@PathVariable Long id) {
        return orderMapper.toDto(orderService.approveCancellation(id));
    }

    // ✅ ADMIN: CANCEL REJECT
    @PutMapping("/{id}/cancel-reject")
    public OrderDto cancelReject(@PathVariable Long id) {
        return orderMapper.toDto(orderService.rejectCancellation(id));
    }
}