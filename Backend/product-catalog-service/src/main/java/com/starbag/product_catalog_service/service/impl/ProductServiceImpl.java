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
    public Product updateProduct(Long id, Product product) {

        Product existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existing.setName(product.getName());
        existing.setCategory(product.getCategory());
        existing.setPrice(product.getPrice());
        existing.setMaterial(product.getMaterial());
        existing.setDimensions(product.getDimensions());
        existing.setCapacity(product.getCapacity());

        existing.getVariants().clear();
        existing.getVariants().addAll(product.getVariants());

        return repository.save(existing);
    }

    @Override
    public void deleteProduct(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Product getProductById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
}
