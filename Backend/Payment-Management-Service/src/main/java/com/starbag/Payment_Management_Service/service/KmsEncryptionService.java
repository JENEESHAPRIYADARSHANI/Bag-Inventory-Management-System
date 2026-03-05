package com.starbag.Payment_Management_Service.service;

import com.amazonaws.services.kms.AWSKMS;
import com.amazonaws.services.kms.model.DecryptRequest;
import com.amazonaws.services.kms.model.EncryptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * KMS Encryption Service
 * Handles encryption and decryption of sensitive payment data using AWS KMS
 */
@Service
public class KmsEncryptionService {

    @Autowired
    private AWSKMS kmsClient;

    @Value("${aws.kms.keyId:}")
    private String kmsKeyId;

    /**
     * Encrypt sensitive data using AWS KMS
     * @param plainText The data to encrypt (e.g., CVV, card number)
     * @return Base64 encoded encrypted data
     */
    public String encrypt(String plainText) {
        if (plainText == null || plainText.isEmpty()) {
            return plainText;
        }

        try {
            // Convert string to bytes
            ByteBuffer plainTextBuffer = ByteBuffer.wrap(
                plainText.getBytes(StandardCharsets.UTF_8)
            );

            // Create encrypt request
            EncryptRequest encryptRequest = new EncryptRequest()
                .withKeyId(kmsKeyId)
                .withPlaintext(plainTextBuffer);

            // Encrypt using KMS
            ByteBuffer encryptedData = kmsClient.encrypt(encryptRequest)
                .getCiphertextBlob();

            // Convert to Base64 for storage
            return Base64.getEncoder().encodeToString(
                encryptedData.array()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt data: " + e.getMessage(), e);
        }
    }

    /**
     * Decrypt data using AWS KMS
     * @param encryptedText Base64 encoded encrypted data
     * @return Decrypted plain text
     */
    public String decrypt(String encryptedText) {
        if (encryptedText == null || encryptedText.isEmpty()) {
            return encryptedText;
        }

        try {
            // Decode from Base64
            byte[] encryptedBytes = Base64.getDecoder().decode(encryptedText);
            ByteBuffer encryptedBuffer = ByteBuffer.wrap(encryptedBytes);

            // Create decrypt request
            DecryptRequest decryptRequest = new DecryptRequest()
                .withCiphertextBlob(encryptedBuffer);

            // Decrypt using KMS
            ByteBuffer decryptedData = kmsClient.decrypt(decryptRequest)
                .getPlaintext();

            // Convert back to string
            return new String(
                decryptedData.array(), 
                StandardCharsets.UTF_8
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt data: " + e.getMessage(), e);
        }
    }

    /**
     * Encrypt card CVV
     */
    public String encryptCvv(String cvv) {
        return encrypt(cvv);
    }

    /**
     * Decrypt card CVV
     */
    public String decryptCvv(String encryptedCvv) {
        return decrypt(encryptedCvv);
    }

    /**
     * Encrypt full card number
     */
    public String encryptCardNumber(String cardNumber) {
        return encrypt(cardNumber);
    }

    /**
     * Decrypt full card number
     */
    public String decryptCardNumber(String encryptedCardNumber) {
        return decrypt(encryptedCardNumber);
    }

    /**
     * Encrypt last 4 digits of card
     */
    public String encryptLast4(String last4) {
        return encrypt(last4);
    }

    /**
     * Decrypt last 4 digits of card
     */
    public String decryptLast4(String encryptedLast4) {
        return decrypt(encryptedLast4);
    }
}
