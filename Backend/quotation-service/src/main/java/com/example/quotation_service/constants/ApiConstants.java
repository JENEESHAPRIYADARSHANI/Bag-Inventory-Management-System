package com.example.quotation_service.constants;

/**
 * Constants for API endpoints and messages
 */
public final class ApiConstants {

    private ApiConstants() {
        // Utility class - prevent instantiation
    }

    // API Endpoints
    public static final String API_BASE_PATH = "/api";
    public static final String QUOTATIONS_PATH = "/quotations";
    public static final String PRODUCTS_PATH = "/products";
    
    // API Messages
    public static final String QUOTATION_NOT_FOUND = "Quotation not found";
    public static final String PRODUCT_NOT_FOUND = "Product not found";
    public static final String INVALID_STATUS_TRANSITION = "Invalid status transition";
    public static final String QUOTATION_CREATED = "Quotation created successfully";
    public static final String QUOTATION_UPDATED = "Quotation updated successfully";
    public static final String QUOTATION_DELETED = "Quotation deleted successfully";
    
    // Validation Messages
    public static final String INVALID_EMAIL = "Invalid email format";
    public static final String INVALID_PHONE = "Invalid phone number format";
    public static final String REQUIRED_FIELD = "This field is required";
    
    // Business Rules
    public static final int DEFAULT_DELIVERY_DAYS = 7;
    public static final int MAX_ITEMS_PER_QUOTATION = 50;
}