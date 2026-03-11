package com.example.quotation_service.constants;

/**
 * Constants for quotation status values
 */
public final class QuotationStatus {

    private QuotationStatus() {
        // Utility class - prevent instantiation
    }

    public static final String DRAFT = "DRAFT";
    public static final String SENT = "SENT";
    public static final String ACCEPTED = "ACCEPTED";
    public static final String REJECTED = "REJECTED";
    public static final String CONVERTED = "CONVERTED";
}