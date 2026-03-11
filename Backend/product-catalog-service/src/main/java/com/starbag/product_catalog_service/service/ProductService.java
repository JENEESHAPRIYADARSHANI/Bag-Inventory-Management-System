package com.starbag.product_catalog_service.service;

import com.starbag.product_catalog_service.domain.Product;
import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();

    Product createProduct(Product product);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);

    Product getProductById(Long id);
}
