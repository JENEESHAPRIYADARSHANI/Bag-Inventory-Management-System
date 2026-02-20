package com.example.quotation_service.config;

import com.example.quotation_service.model.Product;
import com.example.quotation_service.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                System.out.println("Seeding Products...");
                productRepository.saveAll(Arrays.asList(
                        createProduct("Classic Tote Bag", "Durable canvas tote bag", new BigDecimal("15.00")),
                        createProduct("Laptop Backpack", "Water-resistant backpack", new BigDecimal("45.50")),
                        createProduct("Travel Duffle", "Large capacity duffle bag", new BigDecimal("60.00")),
                        createProduct("Messenger Bag", "Stylish leather messenger bag", new BigDecimal("85.00")),
                        createProduct("Shopping Bag", "Reusable eco-friendly shopping bag", new BigDecimal("5.00"))));
            }
        };
    }

    private Product createProduct(String name, String description, BigDecimal price) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setUnitPrice(price);
        return p;
    }
}
