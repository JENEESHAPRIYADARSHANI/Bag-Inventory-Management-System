package com.starbag.product_catalog_service.util;

import com.starbag.product_catalog_service.domain.*;
import com.starbag.product_catalog_service.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CategoryRepository catRepo;

    @Autowired
    private ProductRepository prodRepo;

    @Override
    public void run(String... args) throws Exception {
        // Your data loading logic here...
        String[] catNames = {"Backpacks", "Handbags", "Wallets", "Clutches", "Totes",
                "Messengers", "Briefcases", "Duffels", "Satchels", "Pouches"};

        for (String name : catNames) {
            Category cat = new Category();
            cat.setName(name);
            catRepo.save(cat);

            for (int i = 1; i <= 3; i++) {
                Product p = new Product();
                p.setName(name + " Style " + i);
                p.setPrice(25.0 * i);
                p.setDescription("Premium quality " + name);
                p.setCategory(cat);
                prodRepo.save(p);
            }
        }
        System.out.println("--- Data Loaded Successfully ---");
    }
}