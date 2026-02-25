package com.starbag.Order_Management_Service.service.impl;

import com.starbag.Order_Management_Service.domain.Order;
import com.starbag.Order_Management_Service.domain.OrderStatus;
import com.starbag.Order_Management_Service.exception.InvalidOrderTransitionException;
import com.starbag.Order_Management_Service.exception.OrderNotFoundException;
import com.starbag.Order_Management_Service.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    // Exact allowed lifecycle transitions
    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_LIFECYCLE_TRANSITIONS = Map.of(
            OrderStatus.PENDING, Set.of(OrderStatus.CONFIRMED),
            OrderStatus.CONFIRMED, Set.of(OrderStatus.PROCESSING),
            OrderStatus.PROCESSING, Set.of(OrderStatus.COMPLETED)
    );

    // From these statuses, a user can request cancellation
    private static final Set<OrderStatus> CANCELLABLE_STATUSES =
            EnumSet.of(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING);

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // CREATE ORDER (always starts as PENDING)
    public Order createOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPreviousStatus(null);
        return orderRepository.save(order);
    }

    // GET ALL
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // FILTER BY STATUS
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    // GET ONE
    public Order getOrder(Long id) {
        return findOrderById(id);
    }

    // ADMIN: UPDATE LIFECYCLE STATUS (ONLY PENDING→CONFIRMED→PROCESSING→COMPLETED)
    public Order updateStatus(Long id, OrderStatus newStatus) {
        Order order = findOrderById(id);
        OrderStatus current = order.getStatus();

        // Closed orders cannot change
        if (current == OrderStatus.COMPLETED || current == OrderStatus.CANCELLED) {
            throw new InvalidOrderTransitionException("Order is closed. Cannot change status from " + current);
        }

        // While cancel is pending review, only approve/reject endpoints can change it
        if (current == OrderStatus.CANCEL_REQUESTED) {
            throw new InvalidOrderTransitionException("Order is CANCEL_REQUESTED. Use cancel-approve or cancel-reject.");
        }

        // Prevent setting cancel states via updateStatus endpoint
        if (newStatus == OrderStatus.CANCEL_REQUESTED || newStatus == OrderStatus.CANCELLED) {
            throw new InvalidOrderTransitionException("Use cancel endpoints to handle cancellations.");
        }

        // Enforce exact lifecycle transitions (no skipping)
        Set<OrderStatus> allowedNext = ALLOWED_LIFECYCLE_TRANSITIONS.getOrDefault(current, Collections.emptySet());
        if (!allowedNext.contains(newStatus)) {
            throw new InvalidOrderTransitionException(
                    "Invalid transition: " + current + " → " + newStatus +
                            ". Allowed: " + allowedNext
            );
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // USER: REQUEST CANCEL (ONLY from PENDING/CONFIRMED/PROCESSING)
    public Order requestCancel(Long id) {
        Order order = findOrderById(id);
        OrderStatus current = order.getStatus();

        if (!CANCELLABLE_STATUSES.contains(current)) {
            throw new InvalidOrderTransitionException("Cannot request cancel when status is " + current);
        }

        order.setPreviousStatus(current);
        order.setStatus(OrderStatus.CANCEL_REQUESTED);
        return orderRepository.save(order);
    }

    // ADMIN: APPROVE CANCELLATION (ONLY when CANCEL_REQUESTED)
    public Order approveCancellation(Long id) {
        Order order = findOrderById(id);

        if (order.getStatus() != OrderStatus.CANCEL_REQUESTED) {
            throw new InvalidOrderTransitionException("Only CANCEL_REQUESTED orders can be approved.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        // keep previousStatus for audit OR clear it if you prefer
        return orderRepository.save(order);
    }

    // ADMIN: REJECT CANCELLATION (ONLY when CANCEL_REQUESTED) → revert to previousStatus
    public Order rejectCancellation(Long id) {
        Order order = findOrderById(id);

        if (order.getStatus() != OrderStatus.CANCEL_REQUESTED) {
            throw new InvalidOrderTransitionException("Only CANCEL_REQUESTED orders can be rejected.");
        }

        OrderStatus prev = order.getPreviousStatus();
        if (prev == null) {
            throw new InvalidOrderTransitionException("previousStatus is missing; cannot revert cancellation.");
        }

        order.setStatus(prev);
        order.setPreviousStatus(null);
        return orderRepository.save(order);
    }

    private Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }
}