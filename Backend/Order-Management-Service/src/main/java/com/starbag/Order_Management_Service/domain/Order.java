package com.starbag.Order_Management_Service.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Column(name = "product_ids", columnDefinition = "TEXT")
    private String productIds;

    @Column(name = "quantities", columnDefinition = "TEXT")
    private String quantities;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status")
    private OrderStatus previousStatus;

    public Order() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

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

    public OrderStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(OrderStatus previousStatus) { this.previousStatus = previousStatus; }
}