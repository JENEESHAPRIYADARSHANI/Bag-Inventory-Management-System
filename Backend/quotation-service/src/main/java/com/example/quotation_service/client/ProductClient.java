package com.example.quotation_service.client;

import com.example.quotation_service.dto.ProductDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class ProductClient {

    private final RestTemplate restTemplate;

    @Value("${product.service.url:http://localhost:8081/api/products}")
    private String productServiceUrl;

    public ProductClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<ProductDto> getProducts() {
        try {
            ResponseEntity<List<ProductDto>> response = restTemplate.exchange(
                    productServiceUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<ProductDto>>() {
                    });
            return response.getBody();
        } catch (Exception e) {
            // Fallback if Product Service is down - return temporary products
            System.err.println("Failed to connect to Product Service at " + productServiceUrl + ": " + e.getMessage());
            System.out.println("Using temporary product data...");
            return getTemporaryProducts();
        }
    }

    public ProductDto getProductById(Long id) {
        try {
            return restTemplate.getForObject(productServiceUrl + "/" + id, ProductDto.class);
        } catch (Exception e) {
            System.err.println("Failed to connect to Product Service for ID " + id + ": " + e.getMessage());
            System.out.println("Using temporary product data for ID: " + id);
            
            // Return from temporary products if available
            List<ProductDto> tempProducts = getTemporaryProducts();
            return tempProducts.stream()
                    .filter(p -> p.getId().equals(id))
                    .findFirst()
                    .orElseGet(() -> {
                        ProductDto dummy = new ProductDto();
                        dummy.setId(id);
                        dummy.setName("Temporary Product " + id);
                        dummy.setPrice(new BigDecimal("100.00"));
                        return dummy;
                    });
        }
    }

    /**
     * Temporary product data for testing when Product Service is unavailable
     */
    private List<ProductDto> getTemporaryProducts() {
        List<ProductDto> products = new ArrayList<>();
        
        ProductDto p1 = new ProductDto();
        p1.setId(1L);
        p1.setName("Laptop - Dell XPS 15");
        p1.setPrice(new BigDecimal("1299.99"));
        products.add(p1);
        
        ProductDto p2 = new ProductDto();
        p2.setId(2L);
        p2.setName("Monitor - LG 27 inch 4K");
        p2.setPrice(new BigDecimal("399.99"));
        products.add(p2);
        
        ProductDto p3 = new ProductDto();
        p3.setId(3L);
        p3.setName("Keyboard - Mechanical RGB");
        p3.setPrice(new BigDecimal("89.99"));
        products.add(p3);
        
        ProductDto p4 = new ProductDto();
        p4.setId(4L);
        p4.setName("Mouse - Wireless Gaming");
        p4.setPrice(new BigDecimal("59.99"));
        products.add(p4);
        
        ProductDto p5 = new ProductDto();
        p5.setId(5L);
        p5.setName("Headset - Noise Cancelling");
        p5.setPrice(new BigDecimal("149.99"));
        products.add(p5);
        
        return products;
    }
}
