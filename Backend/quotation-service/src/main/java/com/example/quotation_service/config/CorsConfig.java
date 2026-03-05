package com.example.quotation_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);
        
        // Allowed origins - ADD YOUR FRONTEND URLs HERE
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:8080",           // Vite dev server (current config)
            "http://localhost:5173",           // Vite dev server (default)
            "http://localhost:3000",           // React dev server
            "http://localhost:4200",           // Angular dev server
            "http://127.0.0.1:8080",          // Alternative localhost
            "http://127.0.0.1:5173",          // Alternative localhost
            "https://your-app.netlify.app",   // Replace with your Netlify URL
            "https://your-app.vercel.app"     // Replace with your Vercel URL
            // Add more URLs as needed when you deploy
        ));
        
        // Allowed HTTP methods
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // Allowed headers
        config.setAllowedHeaders(Arrays.asList(
            "Origin",
            "Content-Type",
            "Accept",
            "Authorization",
            "X-Requested-With",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Exposed headers (headers that browser can access)
        config.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        
        // Max age for preflight requests (in seconds)
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
