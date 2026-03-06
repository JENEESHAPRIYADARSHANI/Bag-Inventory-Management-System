package com.example.quotation_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;

import java.util.List;
import java.util.Collections;

@Service
public class OrderProxyService {

    private final RestTemplate restTemplate;

    @Value("${order.service.url:http://localhost:8082}")
    private String orderServiceUrl;

    public OrderProxyService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Get all orders from Order Management Service
     */
    public List<Object> getAllOrders() {
        try {
            String url = orderServiceUrl + "/orders";
            ResponseEntity<List> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                null, 
                List.class
            );
            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Failed to fetch orders from Order Management Service: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    /**
     * Get orders by email from Order Management Service
     */
    public List<Object> getOrdersByEmail(String email) {
        try {
            String url = orderServiceUrl + "/orders?email=" + email;
            ResponseEntity<List> response = restTemplate.exchange(
                url, 
                HttpMethod.GET, 
                null, 
                List.class
            );
            return response.getBody() != null ? response.getBody() : Collections.emptyList();
        } catch (Exception e) {
            System.err.println("Failed to fetch orders by email from Order Management Service: " + e.getMessage());
            return Collections.emptyList();
        }
    }
}