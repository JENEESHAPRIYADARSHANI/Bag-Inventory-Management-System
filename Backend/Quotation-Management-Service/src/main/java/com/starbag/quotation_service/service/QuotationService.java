package com.example.quotation_service.service;

import com.example.quotation_service.dto.QuotationRequest;
import com.example.quotation_service.model.Order;
import com.example.quotation_service.model.Product;
import com.example.quotation_service.model.Quotation;
import com.example.quotation_service.model.QuotationItem;
import com.example.quotation_service.repository.OrderRepository;
import com.example.quotation_service.repository.ProductRepository;
import com.example.quotation_service.repository.QuotationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class QuotationService {

    private final QuotationRepository quotationRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public QuotationService(QuotationRepository quotationRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository) {
        this.quotationRepository = quotationRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
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
        quotation.setCompanyName(request.getCompanyName());
        quotation.setContactPerson(request.getContactPerson());
        quotation.setEmail(request.getEmail());
        quotation.setPhone(request.getPhone());
        quotation.setStatus("DRAFT");

        BigDecimal total = BigDecimal.ZERO;

        if (request.getItems() != null) {
            for (QuotationRequest.ItemRequest itemRequest : request.getItems()) {
                Product product = productRepository.findById(itemRequest.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + itemRequest.getProductId()));

                QuotationItem item = new QuotationItem();
                item.setQuotation(quotation);
                item.setProduct(product);
                item.setQuantity(itemRequest.getQuantity());
                // Use Product's BigDecimal unitPrice
                item.setUnitPrice(product.getUnitPrice());
                item.setDiscount(BigDecimal.ZERO);

                // Line Total = Unit Price * Quantity
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
    public Quotation updateQuotation(Long id, Quotation updatedInfo) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        if (!"DRAFT".equals(quotation.getStatus())) {
            // Admin might want to edit even if not DRAFT?
            // Plan says "Sales Admin reviewing, editing...".
            // Usually Admin edits before Approval.
            // If Approved, maybe can't edit?
            // "Edit unit price -> Save changes -> Approve".
            // So Edit is valid in DRAFT or maybe PENDING status.
            // I'll stick to DRAFT or minimal restrictions for now.
            // But usually you edit before converting.
        }

        quotation.setCompanyName(updatedInfo.getCompanyName());
        quotation.setContactPerson(updatedInfo.getContactPerson());
        quotation.setEmail(updatedInfo.getEmail());
        quotation.setPhone(updatedInfo.getPhone());

        // Handle Item updates
        if (updatedInfo.getItems() != null) {
            // Need to merge or replace items.
            // Simplified: clear and re-add logic if we trusted the input fully.
            // But we need to handle "Edit unit price".
            // The Admin UI will likely send the list of items with updated prices.

            quotation.getItems().clear();
            BigDecimal total = BigDecimal.ZERO;

            for (QuotationItem newItem : updatedInfo.getItems()) {
                Product product = productRepository.findById(newItem.getProduct().getId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                QuotationItem item = new QuotationItem();
                item.setQuotation(quotation);
                item.setProduct(product);
                item.setQuantity(newItem.getQuantity());
                // Admin updated unit price
                item.setUnitPrice(newItem.getUnitPrice());
                // Admin updated discount - FIX: Copy discount from input
                item.setDiscount(newItem.getDiscount());
                // Recalculate line total
                // Line Total = (Unit Price * Quantity) * (1 - Discount/100) if discount is
                // percentage
                // Assuming Discount is percentage (e.g. 10.0 for 10%)

                BigDecimal price = item.getUnitPrice() != null ? item.getUnitPrice() : BigDecimal.ZERO;
                BigDecimal discount = item.getDiscount() != null ? item.getDiscount() : BigDecimal.ZERO;
                BigDecimal qty = BigDecimal.valueOf(item.getQuantity() != null ? item.getQuantity() : 0);

                BigDecimal baseTotal = price.multiply(qty);
                // Discount Amount = Base Total * (Discount / 100)
                BigDecimal discountAmount = baseTotal.multiply(discount).divide(BigDecimal.valueOf(100));
                BigDecimal lineTotal = baseTotal.subtract(discountAmount);

                item.setLineTotal(lineTotal);
                quotation.getItems().add(item);

                total = total.add(lineTotal);
            }
            quotation.setTotalAmount(total);
        }

        return quotationRepository.save(quotation);
    }

    public Quotation approveQuotation(Long id) {
        Quotation quotation = quotationRepository.findById(id).orElseThrow();
        quotation.setStatus("APPROVED");
        return quotationRepository.save(quotation);
    }

    public void rejectQuotation(Long id) {
        Quotation quotation = quotationRepository.findById(id).orElseThrow();
        quotation.setStatus("REJECTED");
        quotationRepository.save(quotation);
    }

    @Transactional
    public Quotation convertToOrder(Long id) {
        Quotation quotation = quotationRepository.findById(id).orElseThrow();

        if (!"APPROVED".equals(quotation.getStatus())) {
            throw new RuntimeException("Only APPROVED quotations can be converted");
        }

        Order order = new Order();
        order.setQuotationId(quotation.getId());
        order.setCompanyName(quotation.getCompanyName());
        order.setTotalAmount(quotation.getTotalAmount());
        order.setStatus("CREATED");
        orderRepository.save(order);

        quotation.setStatus("CONVERTED");
        return quotationRepository.save(quotation);
    }
}
