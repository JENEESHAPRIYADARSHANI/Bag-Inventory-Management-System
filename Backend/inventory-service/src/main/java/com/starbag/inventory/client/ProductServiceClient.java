package com.starbag.inventory.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class ProductServiceClient {

    @Value("${product.service.url}")
    private String productServiceUrl;

    private final RestTemplate restTemplate;

    public ProductServiceClient() {
        this.restTemplate = new RestTemplate();
    }

    public boolean productExists(Long productId) {
        try {
            String url = productServiceUrl + "/" + productId;

            Object response = restTemplate.getForObject(url, Object.class);

            return response != null;

        } catch (Exception e) {
            System.out.println("Product service call failed: " + e.getMessage());
            return false;
        }
    }
}