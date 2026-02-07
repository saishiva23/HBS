package com.hotel.security;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

/**
 * Swagger/OpenAPI Configuration for Hotel Booking System
 * 
 * This configuration provides comprehensive API documentation with JWT-based authentication.
 * Access the Swagger UI at: /swagger-ui.html
 * Access the OpenAPI JSON at: /api-docs
 */

// JWT Bearer Token Authentication
@SecurityScheme(
    name = "bearerAuth", 
    type = SecuritySchemeType.HTTP, 
    scheme = "bearer", 
    bearerFormat = "JWT",
    description = "Enter JWT token obtained from /api/users/signin endpoint. Token will be automatically prefixed with 'Bearer '"
)

// Basic Authentication (fallback)
@SecurityScheme(
    name = "basicAuth", 
    type = SecuritySchemeType.HTTP, 
    scheme = "basic",
    description = "Basic HTTP authentication using email and password"
)

@OpenAPIDefinition(
    info = @Info(
        title = "Hotel Booking System API",
        version = "v1.0",
        description = "RESTful API for Hotel Booking System with comprehensive hotel search, booking management, reviews, and administrative features. "
                    + "This API supports role-based access control with three user types: CUSTOMER, HOTEL_MANAGER, and ADMIN. "
                    + "Most endpoints require JWT authentication obtained through the /api/users/signin endpoint.",
        contact = @Contact(
            name = "Hotel Booking System Support",
            email = "support@hotelbooking.com"
        ),
        license = @License(
            name = "MIT License",
            url = "https://opensource.org/licenses/MIT"
        )
    ),
    servers = {
        @Server(
            url = "http://localhost:8080",
            description = "Local Development Server"
        )
    },
    security = {
        @SecurityRequirement(name = "bearerAuth")
    }
)
@Configuration
public class SwaggerConfig {
}
