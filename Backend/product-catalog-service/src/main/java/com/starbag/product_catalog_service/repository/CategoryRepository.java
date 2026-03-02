package com.starbag.product_catalog_service.repository;

import com.starbag.product_catalog_service.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {}