package com.example.quotation_service.service;

import com.example.quotation_service.client.OrderClient;
import com.example.quotation_service.client.ProductClient;
import com.example.quotation_service.dto.*;
import com.example.quotation_service.model.Order;
import com.example.quotation_service.model.OrderItem;
import com.example.quotation_service.model.Quotation;
import com.example.quotation_service.model.QuotationItem;
import com.example.quotation_service.repository.OrderRepository;
import com.example.quotation_service.repository.QuotationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final OrderRepository orderRepository;
    private final ProductClient productClient;
    private final OrderClient orderClient;

    public QuotationService(QuotationRepository quotationRepository,
            OrderRepository orderRepository,
            ProductClient productClient,
            OrderClient orderClient) {
        this.quotationRepository = quotationRepository;
        this.orderRepository = orderRepository;
        this.productClient = productClient;
        this.orderClient = orderClient;
    }

    public List<ProductDto> getProducts() {
        return productClient.getProducts();
    }

    public List<Quotation> getAllQuotations() {
        return quotationRepository.findAll();
    }

    public Optional<Quotation> getQuotationById(Long id) {
        return quotationRepository.findById(id);
    }

    public List<Quotation> getQuotationsByEmail(String email) {
        return quotationRepository.findByEmail(email);
    }

    @Transactional
    public Quotation createQuotation(QuotationRequest request) {
        Quotation quotation = new Quotation();
        quotation.setCustomerId(request.getCustomerId());
        quotation.setCompanyName(request.getCompanyName());
        quotation.setContactPerson(request.getContactPerson());
        quotation.setEmail(request.getEmail());
        quotation.setPhone(request.getPhone());
        quotation.setStatus("DRAFT");

        BigDecimal total = BigDecimal.ZERO;

        if (request.getItems() != null) {
            for (QuotationRequest.ItemRequest itemRequest : request.getItems()) {
                ProductDto product = productClient.getProductById(itemRequest.getProductId());
                if (product == null) {
                    throw new RuntimeException("Product not found: " + itemRequest.getProductId());
                }

                QuotationItem item = new QuotationItem();
                item.setQuotation(quotation);
                item.setProductId(product.getId());
                item.setQuantity(itemRequest.getQuantity());
                item.setUnitPrice(product.getPrice());
                item.setDiscount(BigDecimal.ZERO);

                BigDecimal quantityIdx = BigDecimal.valueOf(item.getQuantity());
                BigDecimal lineTotal = item.getUnitPrice().multiply(quantityIdx);
                item.setLineTotal(lineTotal);

                quotation.getItems().add(item);
                total = total.add(lineTotal);
            }
        }

        quotation.setTotalAmount(total);
        return quotationRepository.save(quotation);
    }

    @Transactional
    public Quotation updateAndSendQuotation(Long id, QuotationUpdateRequest updateRequest) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        if (!"DRAFT".equals(quotation.getStatus())) {
            throw new RuntimeException("Only DRAFT quotations can be updated and sent");
        }

        if (updateRequest != null && updateRequest.getItems() != null) {
            for (QuotationUpdateRequest.ItemUpdate itemUpdate : updateRequest.getItems()) {
                QuotationItem item = quotation.getItems().stream()
                        .filter(i -> i.getId().equals(itemUpdate.getItemId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Item not found in quotation"));

                if (itemUpdate.getUnitPrice() != null)
                    item.setUnitPrice(itemUpdate.getUnitPrice());
                if (itemUpdate.getDiscount() != null)
                    item.setDiscount(itemUpdate.getDiscount());
            }
        }

        BigDecimal total = BigDecimal.ZERO;
        for (QuotationItem item : quotation.getItems()) {
            BigDecimal price = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
            BigDecimal discount = item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO;
            BigDecimal qty = BigDecimal.valueOf(item.getQuantity() != null ? item.getQuantity() : 0);

            BigDecimal baseTotal = price.multiply(qty);
            // Discount is an absolute amount deduction
            BigDecimal lineTotal = baseTotal.subtract(discount);
            if (lineTotal.compareTo(BigDecimal.ZERO) < 0) {
                lineTotal = BigDecimal.ZERO;
            }

            item.setLineTotal(lineTotal);
            total = total.add(lineTotal);
        }
        quotation.setTotalAmount(total);

        quotation.setStatus("SENT");
        return quotationRepository.save(quotation);
    }

    @Transactional
    public Quotation acceptQuotation(Long id) {
        Quotation quotation = quotationRepository.findById(id).orElseThrow();
        if (!"SENT".equals(quotation.getStatus())) {
            throw new RuntimeException("Only SENT quotations can be accepted");
        }
        quotation.setStatus("ACCEPTED");
        return quotationRepository.save(quotation);
    }

    @Transactional
    public Quotation convertToOrder(Long id) {
        Quotation quotation = quotationRepository.findById(id).orElseThrow();

        if (!"ACCEPTED".equals(quotation.getStatus())) {
            throw new RuntimeException("Only ACCEPTED quotations can be converted");
        }

        // Create order locally (mock Order Service)
        Order order = new Order();
        order.setQuotationId(quotation.getId());
        order.setCustomerId(quotation.getCustomerId());
        order.setEmail(quotation.getEmail());
        order.setCompanyName(quotation.getCompanyName());
        order.setContactPerson(quotation.getContactPerson());
        order.setTotalAmount(quotation.getTotalAmount());
        order.setStatus("CONFIRMED");

        // Copy items from quotation to order
        for (QuotationItem qItem : quotation.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(qItem.getProductId());
            orderItem.setQuantity(qItem.getQuantity());
            orderItem.setUnitPrice(qItem.getUnitPrice());
            orderItem.setDiscount(qItem.getDiscount());
            order.getItems().add(orderItem);
        }

        // Save order locally
        orderRepository.save(order);

        // Try to send to external Order Service (optional, will fail silently if not available)
        try {
            OrderRequestDto orderRequest = new OrderRequestDto();
            orderRequest.setQuotationId(quotation.getId());
            orderRequest.setCustomerId(quotation.getCustomerId());
            orderRequest.setTotalAmount(quotation.getTotalAmount());

            List<OrderRequestDto.OrderItemDto> orderItems = new ArrayList<>();
            for (QuotationItem qItem : quotation.getItems()) {
                OrderRequestDto.OrderItemDto oItem = new OrderRequestDto.OrderItemDto();
                oItem.setProductId(qItem.getProductId());
                oItem.setQuantity(qItem.getQuantity());
                oItem.setUnitPrice(qItem.getUnitPrice());
                oItem.setDiscount(qItem.getDiscount());
                orderItems.add(oItem);
            }
            orderRequest.setItems(orderItems);

            orderClient.createOrder(orderRequest);
        } catch (Exception e) {
            // External Order Service not available, order saved locally only
        }

        quotation.setStatus("CONVERTED");
        return quotationRepository.save(quotation);
    }
}
