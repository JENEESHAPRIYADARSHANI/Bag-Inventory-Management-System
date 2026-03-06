package com.example.quotation_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<?> handleMethodNotSupported(HttpRequestMethodNotSupportedException e) {
        System.err.println("Method not supported exception: " + e.getMessage());
        System.err.println("Supported methods: " + String.join(", ", e.getSupportedMethods()));
        System.err.println("Requested method: " + e.getMethod());
        
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
            .body(Map.of(
                "error", "Method Not Allowed",
                "message", e.getMessage(),
                "method", e.getMethod(),
                "supportedMethods", e.getSupportedMethods()
            ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        System.err.println("Global exception handler caught: " + e.getClass().getName());
        System.err.println("Exception message: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
}
