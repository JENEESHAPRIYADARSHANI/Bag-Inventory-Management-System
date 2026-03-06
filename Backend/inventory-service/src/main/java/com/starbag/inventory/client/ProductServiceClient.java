package com.starbag.inventory.client;

import org.springframework.web.client.RestTemplate;
import org.springframework.stereotype.Component;

@Component
public class ProductServiceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String PRODUCT_SERVICE_URL = "http://18.142.xxx.xxx:8082/api/v1/products/";

    public Object getProductById(Long productId) {
        return restTemplate.getForObject(PRODUCT_SERVICE_URL + productId, Object.class);
    }
}
