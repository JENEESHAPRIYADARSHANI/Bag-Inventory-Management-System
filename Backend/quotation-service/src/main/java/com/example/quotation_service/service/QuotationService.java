package com.example.quotation_service.service;

import com.example.quotation_service.dto.OrderRequestDto;
import com.example.quotation_service.dto.ProductDto;
import com.example.quotation_service.dto.QuotationRequest;
import com.example.quotation_service.dto.QuotationUpdateRequest;
import com.example.quotation_service.model.Quotation;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for quotation management operations
 */
public interface QuotationService {

    /**
     * Get all available products
     * @return List of products
     */
    List<ProductDto> getProducts();

    /**
     * Get all quotations
     * @return List of all quotations
     */
    List<Quotation> getAllQuotations();

    /**
     * Get quotation by ID
     * @param id Quotation ID
     * @return Optional quotation
     */
    Optional<Quotation> getQuotationById(Long id);

    /**
     * Get quotations by customer email
     * @param email Customer email
     * @return List of quotations for the customer
     */
    List<Quotation> getQuotationsByEmail(String email);

    /**
     * Create a new quotation
     * @param request Quotation creation request
     * @return Created quotation
     */
    Quotation createQuotation(QuotationRequest request);

    /**
     * Update and send quotation
     * @param id Quotation ID
     * @param updateRequest Update request with pricing details
     * @return Updated quotation
     */
    Quotation updateAndSendQuotation(Long id, QuotationUpdateRequest updateRequest);

    /**
     * Update quotation without changing status (for users)
     * @param id Quotation ID
     * @param updateRequest Update request with pricing details
     * @return Updated quotation
     */
    Quotation updateQuotation(Long id, QuotationUpdateRequest updateRequest);

    /**
     * Accept a quotation
     * @param id Quotation ID
     * @return Accepted quotation
     */
    Quotation acceptQuotation(Long id);

    /**
     * Convert quotation to order
     * @param id Quotation ID
     * @return Converted quotation
     */
    Quotation convertToOrder(Long id);

    /**
     * Reject a quotation
     * @param id Quotation ID
     * @return Rejected quotation
     */
    Quotation rejectQuotation(Long id);

    /**
     * Delete a quotation
     * @param id Quotation ID
     */
    void deleteQuotation(Long id);
}