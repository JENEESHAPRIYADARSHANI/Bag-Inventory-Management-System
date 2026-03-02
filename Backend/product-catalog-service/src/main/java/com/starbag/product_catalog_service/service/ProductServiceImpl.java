package com.starbag.product_catalog_service.service;

import com.starbag.product_catalog_service.domain.Product;
import com.starbag.product_catalog_service.repository.ProductRepository;

import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ProductServiceImpl implements ProductService {

    // 1. Declare the dependency as final
    private final ProductRepository productRepository;

    // 2. Inject via Constructor
    // @Autowired (Optional if this is the only constructor)
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product findProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}