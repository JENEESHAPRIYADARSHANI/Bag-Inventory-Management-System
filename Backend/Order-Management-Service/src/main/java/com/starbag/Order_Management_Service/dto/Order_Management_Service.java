package com.starbag.Order_Management_Service.dto;

import com.starbag.Order_Management_Service.domain.OrderStatus;

import java.time.LocalDateTime;

public record Order_Management_Service(
        Long id,
        Long customerId,
        String products,
        String quantities,
        LocalDateTime orderDate,
        OrderStatus status
) {}