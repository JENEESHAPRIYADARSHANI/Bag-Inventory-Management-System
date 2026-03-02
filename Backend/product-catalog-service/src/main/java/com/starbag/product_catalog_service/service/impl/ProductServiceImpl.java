package com.starbag.product_catalog_service.service.impl;

import com.starbag.product_catalog_service.service.ProductService;
import com.starbag.product_catalog_service.domain.Product;
import com.starbag.product_catalog_service.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository repository;

    @Override
    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    @Override
    public Product createProduct(Product product) {
        return repository.save(product);
    }

    @Override
    public Product updateProduct(String id, Product product) {
        if (repository.existsById(id)) {
            product.setId(id);
            return repository.save(product);
        }
        throw new RuntimeException("Product not found with id: " + id);
    }

    @Override
    public void deleteProduct(String id) {
        repository.deleteById(id);
    }
}