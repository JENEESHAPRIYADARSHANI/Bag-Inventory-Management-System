package com.example.quotation_service.client;

import com.example.quotation_service.dto.CreateOrderRequest;
import com.example.quotation_service.dto.OrderResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class OrderServiceClient {

    private final RestTemplate restTemplate;

    @Value("${order.service.url:http://localhost:8082}")
    private String orderServiceUrl;

    public OrderServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Create an order in the Order Management Service
     * @param request Order creation request
     * @return Created order response
     * @throws RuntimeException if Order Service is unavailable
     */
    public OrderResponseDto createOrder(CreateOrderRequest request) {
        try {
            String url = orderServiceUrl + "/orders";
            OrderResponseDto response = restTemplate.postForObject(url, request, OrderResponseDto.class);
            
            if (response == null) {
                throw new RuntimeException("Order Service returned null response");
            }
            
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order in Order Management Service: " + e.getMessage(), e);
        }
    }

    /**
     * Get order by ID from Order Management Service
     * @param orderId Order ID
     * @return Order details
     */
    public OrderResponseDto getOrderById(Long orderId) {
        try {
            String url = orderServiceUrl + "/orders/" + orderId;
            return restTemplate.getForObject(url, OrderResponseDto.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch order from Order Management Service: " + e.getMessage(), e);
        }
    }
}
