package com.example.quotation_service.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Utility class for quotation calculations
 */
public class CalculationUtil {

    private static final int DECIMAL_PLACES = 2;
    private static final RoundingMode ROUNDING_MODE = RoundingMode.HALF_UP;

    /**
     * Calculate line total with discount
     * @param unitPrice Unit price of the item
     * @param quantity Quantity of items
     * @param discountPercentage Discount percentage (e.g., 15 for 15%)
     * @return Calculated line total
     */
    public static BigDecimal calculateLineTotal(BigDecimal unitPrice, Integer quantity, BigDecimal discountPercentage) {
        if (unitPrice == null || quantity == null) {
            return BigDecimal.ZERO;
        }

        BigDecimal qty = BigDecimal.valueOf(quantity);
        BigDecimal baseTotal = unitPrice.multiply(qty);

        if (discountPercentage == null || discountPercentage.compareTo(BigDecimal.ZERO) == 0) {
            return baseTotal.setScale(DECIMAL_PLACES, ROUNDING_MODE);
        }

        // Apply discount percentage
        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(
            discountPercentage.divide(new BigDecimal(100), DECIMAL_PLACES, ROUNDING_MODE)
        );
        
        BigDecimal lineTotal = baseTotal.multiply(discountMultiplier);
        
        // Ensure non-negative result
        if (lineTotal.compareTo(BigDecimal.ZERO) < 0) {
            lineTotal = BigDecimal.ZERO;
        }

        return lineTotal.setScale(DECIMAL_PLACES, ROUNDING_MODE);
    }

    /**
     * Calculate discount amount
     * @param baseAmount Base amount before discount
     * @param discountPercentage Discount percentage
     * @return Discount amount
     */
    public static BigDecimal calculateDiscountAmount(BigDecimal baseAmount, BigDecimal discountPercentage) {
        if (baseAmount == null || discountPercentage == null) {
            return BigDecimal.ZERO;
        }

        return baseAmount.multiply(discountPercentage.divide(new BigDecimal(100), DECIMAL_PLACES, ROUNDING_MODE))
                .setScale(DECIMAL_PLACES, ROUNDING_MODE);
    }

    /**
     * Round amount to standard decimal places
     * @param amount Amount to round
     * @return Rounded amount
     */
    public static BigDecimal roundAmount(BigDecimal amount) {
        if (amount == null) {
            return BigDecimal.ZERO;
        }
        return amount.setScale(DECIMAL_PLACES, ROUNDING_MODE);
    }
}