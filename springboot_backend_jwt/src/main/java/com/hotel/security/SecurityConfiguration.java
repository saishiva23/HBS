package com.hotel.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
@Slf4j
public class SecurityConfiguration {
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("Configuring Spring Security filter chain");

        http.csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(request -> request
                        .requestMatchers("/", "/error", "/v3/api-docs/**", "/api-docs/**", "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api/users/signin",
                                "/api/users/signup",
                                "/api/users/generate-hash",
                                "/api/users/debug-password",
                                "/api/users/fix-passwords",
                                "/api/users/forgot-password",
                                "/api/users/validate-reset-token",
                                "/api/users/reset-password-with-token")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/hotels/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/availability/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/hotels/register-public").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/users").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/hotels").hasAuthority("ROLE_HOTEL_MANAGER")
                        .requestMatchers("/api/bookings/**")
                        .hasAnyAuthority("ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_HOTEL_MANAGER")
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        log.info("Configuring DaoAuthenticationProvider with UserDetailsService and PasswordEncoder");
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        log.info("Configuring AuthenticationManager");
        // Spring Boot will automatically use our AuthenticationProvider bean
        return config.getAuthenticationManager();
    }
}
