package com.starbag.Order_Management_Service.dto;

import com.starbag.Order_Management_Service.domain.OrderStatus;
import java.time.LocalDateTime;

public class OrderDto {
    private Long id;
    private Long customerId;
    private String customerName;
    private Long quotationId;
    private Double totalAmount;
    private LocalDateTime deliveryDate;

    private String productIds;
    private String quantities;
    private LocalDateTime orderDate;
    private OrderStatus status;

    public OrderDto() {}

    public OrderDto(
            Long id,
            Long customerId,
            String customerName,
            Long quotationId,
            Double totalAmount,
            LocalDateTime deliveryDate,
            String productIds,
            String quantities,
            LocalDateTime orderDate,
            OrderStatus status
    ) {
        this.id = id;
        this.customerId = customerId;
        this.customerName = customerName;
        this.quotationId = quotationId;
        this.totalAmount = totalAmount;
        this.deliveryDate = deliveryDate;
        this.productIds = productIds;
        this.quantities = quantities;
        this.orderDate = orderDate;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Long getQuotationId() { return quotationId; }
    public void setQuotationId(Long quotationId) { this.quotationId = quotationId; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDateTime deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getProductIds() { return productIds; }
    public void setProductIds(String productIds) { this.productIds = productIds; }

    public String getQuantities() { return quantities; }
    public void setQuantities(String quantities) { this.quantities = quantities; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
}