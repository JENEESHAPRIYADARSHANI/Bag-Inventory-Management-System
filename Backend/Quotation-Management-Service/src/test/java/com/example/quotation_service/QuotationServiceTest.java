package com.example.quotation_service;

import com.example.quotation_service.dto.QuotationRequest;
import com.example.quotation_service.model.Product;
import com.example.quotation_service.model.Quotation;
import com.example.quotation_service.model.QuotationItem;
import com.example.quotation_service.repository.ProductRepository;
import com.example.quotation_service.repository.QuotationRepository;
import com.example.quotation_service.service.QuotationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class QuotationServiceTest {

    @Mock
    private QuotationRepository quotationRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private com.example.quotation_service.repository.OrderRepository orderRepository;

    @InjectMocks
    private QuotationService quotationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createQuotationr_shouldCalculateTotalCorrectly() {
        QuotationRequest request = new QuotationRequest();
        request.setCompanyName("Test Corp");
        request.setContactPerson("John Doe");
        request.setEmail("john@test.com");

        List<QuotationRequest.ItemRequest> items = new ArrayList<>();
        QuotationRequest.ItemRequest item1 = new QuotationRequest.ItemRequest();
        item1.setProductId(1L);
        item1.setQuantity(2);
        items.add(item1);
        request.setItems(items);

        Product product = new Product();
        product.setId(1L);
        product.setUnitPrice(new BigDecimal("10.00"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(quotationRepository.save(any(Quotation.class))).thenAnswer(i -> i.getArguments()[0]);

        Quotation created = quotationService.createQuotation(request);

        assertNotNull(created);
        assertEquals("DRAFT", created.getStatus());
        assertEquals(0, new BigDecimal("20.00").compareTo(created.getTotalAmount()));
        assertEquals(1, created.getItems().size());
        assertEquals(0, new BigDecimal("20.00").compareTo(created.getItems().get(0).getLineTotal()));
    }

    @Test
    void convertToOrder_shouldFailIfNotApproved() {
        Quotation quotation = new Quotation();
        quotation.setId(1L);
        quotation.setStatus("DRAFT");

        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));

        assertThrows(RuntimeException.class, () -> quotationService.convertToOrder(1L));
    }

    @Test
    void convertToOrder_shouldSucceedIfApproved() {
        Quotation quotation = new Quotation();
        quotation.setId(1L);
        quotation.setStatus("APPROVED");

        when(quotationRepository.findById(1L)).thenReturn(Optional.of(quotation));
        when(quotationRepository.save(any(Quotation.class))).thenAnswer(i -> i.getArguments()[0]);

        Quotation converted = quotationService.convertToOrder(1L);

        assertEquals("CONVERTED", converted.getStatus());
    }

    @Test
    void updateQuotation_shouldRecalculateTotals() {
        Quotation existing = new Quotation();
        existing.setId(1L);
        existing.setStatus("DRAFT");
        existing.setItems(new ArrayList<>());

        when(quotationRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(quotationRepository.save(any(Quotation.class))).thenAnswer(i -> i.getArguments()[0]);

        Product product = new Product();
        product.setId(1L);
        product.setUnitPrice(new BigDecimal("100.00"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Quotation updateInfo = new Quotation();
        QuotationItem item = new QuotationItem();
        item.setProduct(product);
        item.setQuantity(2);
        item.setUnitPrice(new BigDecimal("90.00")); // Discounted price
        item.setDiscount(new BigDecimal("10.00")); // 10% discount

        List<QuotationItem> items = new ArrayList<>();
        items.add(item);
        updateInfo.setItems(items);

        Quotation updated = quotationService.updateQuotation(1L, updateInfo);

        // Base Total = 90 * 2 = 180
        // Discount Amount = 180 * 0.10 = 18
        // Line Total = 180 - 18 = 162

        assertEquals(0, new BigDecimal("162.00").compareTo(updated.getTotalAmount()));
    }

    @Test
    void getQuotationsByEmail_shouldReturnList() {
        String email = "test@example.com";
        List<Quotation> expected = new ArrayList<>();
        expected.add(new Quotation());

        when(quotationRepository.findByEmail(email)).thenReturn(expected);

        List<Quotation> result = quotationService.getQuotationsByEmail(email);

        assertEquals(1, result.size());
        verify(quotationRepository, times(1)).findByEmail(email);
    }
}
