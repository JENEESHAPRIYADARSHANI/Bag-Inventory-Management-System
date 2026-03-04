package com.starbag.Payment_Management_Service.controller;

import com.amazonaws.services.kms.AWSKMS;
import com.amazonaws.services.kms.model.DescribeKeyRequest;
import com.amazonaws.services.kms.model.DescribeKeyResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * AWS Health Check Controller
 * Provides endpoints to verify AWS KMS connection status
 */
@RestController
@RequestMapping("/api/aws")
public class AwsHealthCheckController {

    @Autowired
    private AWSKMS kmsClient;

    @Value("${aws.kms.keyId:}")
    private String kmsKeyId;

    @Value("${aws.region:}")
    private String awsRegion;

    /**
     * Check if AWS KMS is connected and accessible
     * Access: http://localhost:8085/api/aws/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkAwsHealth() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if credentials are configured
            if (kmsKeyId == null || kmsKeyId.isEmpty() || kmsKeyId.equals("YOUR_KMS_KEY_ID")) {
                response.put("status", "NOT_CONFIGURED");
                response.put("message", "AWS KMS credentials not configured in application.properties");
                response.put("configured", false);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
            }

            // Try to describe the KMS key (this verifies connection and permissions)
            DescribeKeyRequest request = new DescribeKeyRequest().withKeyId(kmsKeyId);
            DescribeKeyResult result = kmsClient.describeKey(request);
            
            response.put("status", "CONNECTED");
            response.put("message", "AWS KMS is connected and working");
            response.put("configured", true);
            response.put("region", awsRegion);
            response.put("keyId", kmsKeyId);
            response.put("keyArn", result.getKeyMetadata().getArn());
            response.put("keyState", result.getKeyMetadata().getKeyState());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Failed to connect to AWS KMS: " + e.getMessage());
            response.put("configured", false);
            response.put("error", e.getClass().getSimpleName());
            response.put("region", awsRegion);
            response.put("keyId", kmsKeyId);
            
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }
    }

    /**
     * Test encryption/decryption with AWS KMS
     * Access: http://localhost:8085/api/aws/test-encryption
     */
    @GetMapping("/test-encryption")
    public ResponseEntity<Map<String, Object>> testEncryption() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String testData = "TEST123";
            
            // Import the encryption service
            com.starbag.Payment_Management_Service.service.KmsEncryptionService encryptionService = 
                new com.starbag.Payment_Management_Service.service.KmsEncryptionService();
            
            // Use reflection to set the kmsClient (since we can't autowire in this context)
            java.lang.reflect.Field kmsClientField = encryptionService.getClass().getDeclaredField("kmsClient");
            kmsClientField.setAccessible(true);
            kmsClientField.set(encryptionService, kmsClient);
            
            java.lang.reflect.Field kmsKeyIdField = encryptionService.getClass().getDeclaredField("kmsKeyId");
            kmsKeyIdField.setAccessible(true);
            kmsKeyIdField.set(encryptionService, kmsKeyId);
            
            // Test encryption
            String encrypted = encryptionService.encrypt(testData);
            
            // Test decryption
            String decrypted = encryptionService.decrypt(encrypted);
            
            boolean success = testData.equals(decrypted);
            
            response.put("status", success ? "SUCCESS" : "FAILED");
            response.put("message", success ? "Encryption/Decryption test passed" : "Decrypted data doesn't match original");
            response.put("originalData", testData);
            response.put("encryptedData", encrypted.substring(0, Math.min(50, encrypted.length())) + "...");
            response.put("decryptedData", decrypted);
            response.put("testPassed", success);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Encryption test failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Get AWS configuration info (without sensitive data)
     * Access: http://localhost:8085/api/aws/config
     */
    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getAwsConfig() {
        Map<String, Object> response = new HashMap<>();
        
        response.put("region", awsRegion);
        response.put("keyIdConfigured", kmsKeyId != null && !kmsKeyId.isEmpty() && !kmsKeyId.equals("YOUR_KMS_KEY_ID"));
        response.put("keyIdPreview", kmsKeyId != null && kmsKeyId.length() > 8 ? 
            kmsKeyId.substring(0, 8) + "..." : "NOT_SET");
        
        return ResponseEntity.ok(response);
    }

    /**
     * Test encryption with sample payment data
     * Access: http://localhost:8085/api/aws/test-payment-encryption
     */
    @GetMapping("/test-payment-encryption")
    public ResponseEntity<Map<String, Object>> testPaymentEncryption() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            com.starbag.Payment_Management_Service.service.KmsEncryptionService encryptionService = 
                new com.starbag.Payment_Management_Service.service.KmsEncryptionService();
            
            // Set dependencies using reflection
            java.lang.reflect.Field kmsClientField = encryptionService.getClass().getDeclaredField("kmsClient");
            kmsClientField.setAccessible(true);
            kmsClientField.set(encryptionService, kmsClient);
            
            java.lang.reflect.Field kmsKeyIdField = encryptionService.getClass().getDeclaredField("kmsKeyId");
            kmsKeyIdField.setAccessible(true);
            kmsKeyIdField.set(encryptionService, kmsKeyId);
            
            // Test with sample payment data
            String sampleCVV = "123";
            String sampleCardNumber = "4111111111111111";
            String sampleLast4 = "1111";
            
            // Encrypt
            String encryptedCVV = encryptionService.encryptCvv(sampleCVV);
            String encryptedCardNumber = encryptionService.encryptCardNumber(sampleCardNumber);
            String encryptedLast4 = encryptionService.encryptLast4(sampleLast4);
            
            // Decrypt
            String decryptedCVV = encryptionService.decryptCvv(encryptedCVV);
            String decryptedCardNumber = encryptionService.decryptCardNumber(encryptedCardNumber);
            String decryptedLast4 = encryptionService.decryptLast4(encryptedLast4);
            
            // Verify
            boolean cvvMatch = sampleCVV.equals(decryptedCVV);
            boolean cardMatch = sampleCardNumber.equals(decryptedCardNumber);
            boolean last4Match = sampleLast4.equals(decryptedLast4);
            boolean allMatch = cvvMatch && cardMatch && last4Match;
            
            response.put("status", allMatch ? "SUCCESS" : "FAILED");
            response.put("message", allMatch ? "Payment data encryption/decryption working correctly" : "Some decryption failed");
            
            // CVV test
            Map<String, Object> cvvTest = new HashMap<>();
            cvvTest.put("original", sampleCVV);
            cvvTest.put("encrypted", encryptedCVV.substring(0, Math.min(30, encryptedCVV.length())) + "...");
            cvvTest.put("decrypted", decryptedCVV);
            cvvTest.put("match", cvvMatch);
            response.put("cvvTest", cvvTest);
            
            // Card Number test
            Map<String, Object> cardTest = new HashMap<>();
            cardTest.put("original", sampleCardNumber);
            cardTest.put("encrypted", encryptedCardNumber.substring(0, Math.min(30, encryptedCardNumber.length())) + "...");
            cardTest.put("decrypted", decryptedCardNumber);
            cardTest.put("match", cardMatch);
            response.put("cardNumberTest", cardTest);
            
            // Last 4 test
            Map<String, Object> last4Test = new HashMap<>();
            last4Test.put("original", sampleLast4);
            last4Test.put("encrypted", encryptedLast4.substring(0, Math.min(30, encryptedLast4.length())) + "...");
            last4Test.put("decrypted", decryptedLast4);
            last4Test.put("match", last4Match);
            response.put("last4Test", last4Test);
            
            response.put("allTestsPassed", allMatch);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("status", "ERROR");
            response.put("message", "Payment encryption test failed: " + e.getMessage());
            response.put("error", e.getClass().getSimpleName());
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
