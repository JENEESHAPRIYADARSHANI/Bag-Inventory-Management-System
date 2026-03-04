package com.starbag.production.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // This applies CORS rules to ALL endpoints in your application (/**)
        registry.addMapping("/**")
                .allowedOriginPatterns("*") // Allows requests from any frontend port (e.g., React on 5173 or 3000)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allows these specific HTTP actions
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}