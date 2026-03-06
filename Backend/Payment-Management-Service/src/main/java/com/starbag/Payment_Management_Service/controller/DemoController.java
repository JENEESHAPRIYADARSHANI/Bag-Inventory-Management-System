package com.starbag.Payment_Management_Service.controller;

import com.starbag.Payment_Management_Service.entity.SavedPaymentMethod;
import com.starbag.Payment_Management_Service.repo.SavedMethodRepository;
import com.starbag.Payment_Management_Service.service.PaymentMethodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*")
public class DemoController {
    
    @Autowired
    private SavedMethodRepository repository;
    
    @Autowired
    private DataSource dataSource;
    
    @Autowired
    private PaymentMethodService paymentMethodService;
    
    @Value("${spring.datasource.url}")
    private String dbUrl;
    
    @Value("${aws.region}")
    private String awsRegion;
    
    // 1. Health Check
    @GetMapping("/health")
    public Map<String, Object> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Payment Management Service");
        response.put("timestamp", System.currentTimeMillis());
        return response;
    }
    
    // 2. Database Connection Check
    @GetMapping("/db-check")
    public ResponseEntity<Map<String, Object>> checkDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Test connection
            Connection conn = dataSource.getConnection();
            boolean isConnected = conn.isValid(5);
            conn.close();
            
            response.put("status", isConnected ? "CONNECTED" : "DISCONNECTED");
            response.put("database", "AWS RDS MySQL");
            response.put("url", dbUrl.replaceAll("password=[^&]*", "password=***"));
            response.put("region", awsRegion);
            response.put("recordCount", repository.count());
            response.put("message", "Successfully connected to AWS RDS");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Failed to connect to database");
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // 3. Encryption Test
    @GetMapping("/encryption-test")
    public ResponseEntity<Map<String, Object>> testEncryption() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String testData = "4111-1111-1111-1111";
            
            // Test encryption
            String encrypted = paymentMethodService.encryptData(testData);
            String decrypted = paymentMethodService.decryptData(encrypted);
            
            boolean encryptionWorks = testData.equals(decrypted);
            
            response.put("status", encryptionWorks ? "SUCCESS" : "FAILED");
            response.put("kmsRegion", awsRegion);
            response.put("originalData", testData);
            response.put("encryptedData", encrypted.substring(0, Math.min(50, encrypted.length())) + "...");
            response.put("decryptedData", decrypted);
            response.put("encryptionWorking", encryptionWorks);
            response.put("message", "AWS KMS encryption is working correctly");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Encryption test failed");
            response.put("error", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // 4. Complete System Check
    @GetMapping("/system-check")
    public ResponseEntity<Map<String, Object>> systemCheck() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> checks = new HashMap<>();
        
        // Database check
        try {
            Connection conn = dataSource.getConnection();
            checks.put("database", conn.isValid(5) ? "✓ PASS" : "✗ FAIL");
            conn.close();
        } catch (Exception e) {
            checks.put("database", "✗ FAIL - " + e.getMessage());
        }
        
        // Encryption check
        try {
            String test = "test-data";
            String encrypted = paymentMethodService.encryptData(test);
            String decrypted = paymentMethodService.decryptData(encrypted);
            checks.put("encryption", test.equals(decrypted) ? "✓ PASS" : "✗ FAIL");
        } catch (Exception e) {
            checks.put("encryption", "✗ FAIL - " + e.getMessage());
        }
        
        // Record count check
        try {
            long count = repository.count();
            checks.put("dataAccess", "✓ PASS - " + count + " records");
        } catch (Exception e) {
            checks.put("dataAccess", "✗ FAIL - " + e.getMessage());
        }
        
        response.put("service", "Payment Management Service");
        response.put("checks", checks);
        response.put("awsRegion", awsRegion);
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
    
    // 5. View Payment Methods
    @GetMapping("/payment-methods")
    public List<SavedPaymentMethod> getAllPaymentMethods() {
        return repository.findAll();
    }
    
    // 6. Database Stats
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRecords", repository.count());
        stats.put("tableName", "saved_payment_methods");
        stats.put("database", "AWS RDS MySQL");
        stats.put("region", awsRegion);
        return stats;
    }
}
