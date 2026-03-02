package com.starbag.production.exception;

// We use RuntimeException so we don't have to add "throws" to every single method in our app
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}