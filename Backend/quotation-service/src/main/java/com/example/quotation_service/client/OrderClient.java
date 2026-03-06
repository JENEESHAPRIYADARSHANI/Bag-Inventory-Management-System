package com.example.quotation_service.client;

import com.example.quotation_service.dto.OrderRequestDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

@Component
public class OrderClient {

    private final RestTemplate restTemplate;

    @Value("${order.service.url:http://localhost:8082/api/orders}")
    private String orderServiceUrl;

    public OrderClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String createOrder(OrderRequestDto orderRequest) {
        // Convert to the format expected by Order Management Service
        Map<String, Object> orderDto = new HashMap<>();
        
        // Parse customerId to Long
        try {
            orderDto.put("customerId", Long.parseLong(orderRequest.getCustomerId()));
        } catch (NumberFormatException e) {
            orderDto.put("customerId", 0L);
        }
        
        orderDto.put("customerName", orderRequest.getCustomerName());
        orderDto.put("totalAmount", orderRequest.getTotalAmount().doubleValue());
        orderDto.put("productIds", orderRequest.getProductIds());
        orderDto.put("quantities", orderRequest.getQuantities());
        orderDto.put("deliveryDate", orderRequest.getDeliveryDate());
        orderDto.put("orderDate", java.time.LocalDateTime.now());
        orderDto.put("status", "PENDING"); // Initial status
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(orderDto, headers);
        
        // Post the order request
        return restTemplate.postForObject(orderServiceUrl, request, String.class);
    }
}
