package com.example.backend.config.security;

import com.example.backend.config.security.jwt.JwtFilter;
import com.example.backend.config.redis.RateLimitingFilter;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final RateLimitingFilter rateLimitingFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // ✅ allow ALL GET requests (public + optional JWT)
                .requestMatchers(HttpMethod.GET, "/**").permitAll()

                // auth endpoints
                .requestMatchers("/auth/**").permitAll()

                // swagger + misc
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/v3/api-docs.yaml",
                        "/redis-test",
                        "/ping",
                        "/ws/**",
                        "/winner"
                ).permitAll()

                // 🔒 everything else requires JWT
                .anyRequest().authenticated()
            )

            // 🚀 Rate limiting first
            .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)

            // 🔐 JWT filter
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

            .httpBasic(httpBasic -> httpBasic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}