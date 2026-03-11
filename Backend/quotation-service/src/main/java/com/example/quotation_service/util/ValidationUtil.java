package com.example.quotation_service.util;

import java.util.regex.Pattern;

/**
 * Utility class for validation operations
 */
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
        "^[+]?[0-9]{10,15}$"
    );

    /**
     * Validate email format
     * @param email Email to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Validate phone number format
     * @param phone Phone number to validate
     * @return true if valid, false otherwise
     */
    public static boolean isValidPhone(String phone) {
        return phone != null && PHONE_PATTERN.matcher(phone.replaceAll("\\s+", "")).matches();
    }

    /**
     * Check if string is not null and not empty
     * @param str String to check
     * @return true if not null and not empty, false otherwise
     */
    public static boolean isNotEmpty(String str) {
        return str != null && !str.trim().isEmpty();
    }

    /**
     * Validate quotation status transition
     * @param currentStatus Current status
     * @param newStatus New status to transition to
     * @return true if transition is valid, false otherwise
     */
    public static boolean isValidStatusTransition(String currentStatus, String newStatus) {
        if (currentStatus == null || newStatus == null) {
            return false;
        }

        return switch (currentStatus) {
            case "DRAFT" -> "SENT".equals(newStatus) || "REJECTED".equals(newStatus);
            case "SENT" -> "ACCEPTED".equals(newStatus) || "REJECTED".equals(newStatus);
            case "ACCEPTED" -> "CONVERTED".equals(newStatus);
            default -> false;
        };
    }
}