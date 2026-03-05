package com.starbag.Order_Management_Service.mapper;

import com.starbag.Order_Management_Service.domain.Order;
import com.starbag.Order_Management_Service.dto.OrderDto;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderDto toDto(Order o) {
        if (o == null) return null;

        return new OrderDto(
                o.getId(),
                o.getCustomerId(),
                o.getCustomerName(),
                o.getTotalAmount(),
                o.getDeliveryDate(),
                o.getProductIds(),
                o.getQuantities(),
                o.getOrderDate(),
                o.getStatus()
        );
    }

    public Order fromDto(OrderDto dto) {
        if (dto == null) return null;

        Order o = new Order();
        o.setCustomerId(dto.getCustomerId());
        o.setCustomerName(dto.getCustomerName());
        o.setTotalAmount(dto.getTotalAmount());
        o.setDeliveryDate(dto.getDeliveryDate());
        o.setProductIds(dto.getProductIds());
        o.setQuantities(dto.getQuantities());
        return o;
    }
}