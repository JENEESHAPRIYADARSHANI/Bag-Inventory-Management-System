package com.starbag.product_catalog_service.service;


import com.starbag.product_catalog_service.domain.Product;
import java.util.List;


public interface ProductService {
    List<Product> findAllProducts();
    Product saveProduct(Product product);
    Product findProductById(Long id);
    void deleteProduct(Long id);
}