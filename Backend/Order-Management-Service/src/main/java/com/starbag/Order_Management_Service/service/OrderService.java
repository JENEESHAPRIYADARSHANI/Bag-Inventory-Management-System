package com.starbag.Order_Management_Service.service;

import com.starbag.Order_Management_Service.domain.Order;
import com.starbag.Order_Management_Service.domain.OrderStatus;
import com.starbag.Order_Management_Service.exception.InvalidOrderTransitionException;
import com.starbag.Order_Management_Service.exception.OrderNotFoundException;
import com.starbag.Order_Management_Service.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_LIFECYCLE_TRANSITIONS = Map.of(
            OrderStatus.PENDING, Set.of(OrderStatus.CONFIRMED),
            OrderStatus.CONFIRMED, Set.of(OrderStatus.PROCESSING),
            OrderStatus.PROCESSING, Set.of(OrderStatus.COMPLETED)
    );

    private static final Set<OrderStatus> USER_CANCELLABLE_STATUSES =
            EnumSet.of(OrderStatus.PENDING, OrderStatus.CONFIRMED);

    private static final Set<OrderStatus> ADMIN_CANCELLABLE_STATUSES =
            EnumSet.of(OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING);

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setPreviousStatus(null);
        return orderRepository.save(order);
    }

    public List<Order> getOrdersForCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public Order getOrder(Long id) {
        return findOrderById(id);
    }

    public Order updateStatus(Long id, OrderStatus newStatus) {
        Order order = findOrderById(id);
        OrderStatus current = order.getStatus();

        if (current == OrderStatus.COMPLETED || current == OrderStatus.CANCELLED) {
            throw new InvalidOrderTransitionException(
                    "Order is closed. Cannot change status from " + current
            );
        }

        if (current == OrderStatus.CANCEL_REQUESTED) {
            throw new InvalidOrderTransitionException(
                    "Order is in legacy CANCEL_REQUESTED status. Resolve it manually in the database or move it to CANCELLED."
            );
        }

        if (newStatus == OrderStatus.CANCELLED || newStatus == OrderStatus.CANCEL_REQUESTED) {
            throw new InvalidOrderTransitionException(
                    "Use cancel endpoints to handle cancellations."
            );
        }

        Set<OrderStatus> allowedNext =
                ALLOWED_LIFECYCLE_TRANSITIONS.getOrDefault(current, Collections.emptySet());

        if (!allowedNext.contains(newStatus)) {
            throw new InvalidOrderTransitionException(
                    "Invalid transition: " + current + " → " + newStatus + ". Allowed: " + allowedNext
            );
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public Order cancelByUser(Long id) {
        Order order = findOrderById(id);
        OrderStatus current = order.getStatus();

        if (!USER_CANCELLABLE_STATUSES.contains(current)) {
            throw new InvalidOrderTransitionException(
                    "Order cannot be cancelled by user when status is " + current
            );
        }

        if (order.getOrderDate() == null) {
            throw new InvalidOrderTransitionException(
                    "Order date is missing. Cannot validate 2-day cancellation rule."
            );
        }

        LocalDateTime cancelDeadline = order.getOrderDate().plusDays(2);

        if (LocalDateTime.now().isAfter(cancelDeadline)) {
            throw new InvalidOrderTransitionException(
                    "Order can only be cancelled within 2 days of placing it."
            );
        }

        order.setPreviousStatus(current);
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    public Order cancelByAdmin(Long id) {
        Order order = findOrderById(id);
        OrderStatus current = order.getStatus();

        if (!ADMIN_CANCELLABLE_STATUSES.contains(current)) {
            throw new InvalidOrderTransitionException(
                    "Admin cannot cancel order when status is " + current
            );
        }

        order.setPreviousStatus(current);
        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    private Order findOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }
}