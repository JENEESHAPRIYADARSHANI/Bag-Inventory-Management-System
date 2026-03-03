package com.example.quotation_service.client;

import com.example.quotation_service.dto.OrderRequestDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

@Component
public class OrderClient {

    private final RestTemplate restTemplate;

    @Value("${order.service.url:http://localhost:8082/api/orders}")
    private String orderServiceUrl;

    public OrderClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String createOrder(OrderRequestDto orderRequest) {
        // Post the order request and obtain response. Assuming the Order service
        // returns a simple string message or the Order object
        // Return type can be structured better if we create an OrderResponseDto
        return restTemplate.postForObject(orderServiceUrl, orderRequest, String.class);
    }
}
