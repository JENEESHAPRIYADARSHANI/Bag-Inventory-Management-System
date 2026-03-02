package com.starbag.product_catalog_service.controller;


import com.starbag.product_catalog_service.domain.Product;
import com.starbag.product_catalog_service.service.ProductService; // Import Service, not Repository
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    // 1. Change this from ProductRepository to ProductService
    private final ProductService productService;

    // 2. Inject the Service in the constructor
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 1. CREATE
    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        // Call the service method
        return productService.saveProduct(product);
    }

    // 2. READ ALL
    @GetMapping
    public List<Product> getAllProducts() {
        // Call the service method
        return productService.findAllProducts();
    }

    // 3. READ ONE
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        // Call the service method
        return productService.findProductById(id);
    }

    // 4. DELETE (Optional - if you want to expose it)
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}