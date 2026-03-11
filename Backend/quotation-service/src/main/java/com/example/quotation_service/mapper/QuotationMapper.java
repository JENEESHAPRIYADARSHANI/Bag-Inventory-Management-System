package com.example.quotation_service.mapper;

import com.example.quotation_service.model.Quotation;
import com.example.quotation_service.model.QuotationItem;
import com.example.quotation_service.dto.QuotationRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;

/**
 * Mapper class for converting between Quotation DTOs and domain entities
 */
@Component
public class QuotationMapper {

    /**
     * Convert QuotationRequest DTO to Quotation domain entity
     * @param request QuotationRequest DTO
     * @return Quotation domain entity
     */
    public Quotation toEntity(QuotationRequest request) {
        if (request == null) {
            return null;
        }

        Quotation quotation = new Quotation();
        quotation.setCustomerId(request.getCustomerId());
        quotation.setCompanyName(request.getCompanyName());
        quotation.setContactPerson(request.getContactPerson());
        quotation.setEmail(request.getEmail());
        quotation.setPhone(request.getPhone());
        quotation.setStatus("DRAFT");
        quotation.setTotalAmount(BigDecimal.ZERO);
        quotation.setItems(new ArrayList<>());

        return quotation;
    }

    /**
     * Convert QuotationRequest.ItemRequest to QuotationItem domain entity
     * @param itemRequest Item request DTO
     * @param quotation Parent quotation
     * @return QuotationItem domain entity
     */
    public QuotationItem toItemEntity(QuotationRequest.ItemRequest itemRequest, Quotation quotation) {
        if (itemRequest == null) {
            return null;
        }

        QuotationItem item = new QuotationItem();
        item.setQuotation(quotation);
        item.setProductId(itemRequest.getProductId());
        item.setQuantity(itemRequest.getQuantity());
        item.setDiscount(BigDecimal.ZERO);
        item.setLineTotal(BigDecimal.ZERO);

        return item;
    }
}