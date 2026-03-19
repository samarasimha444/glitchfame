package com.example.backend.config.security;
import com.example.backend.config.security.jwt.JwtFilter;
import com.example.backend.config.redis.RateLimitingFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;





@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter; // jwt filter
    private final RateLimitingFilter rateLimitingFilter; // rate limiter

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth

                // allow all auth endpoints
                .requestMatchers("/auth/**").permitAll()

                // allow swagger + health/test endpoints
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/v3/api-docs.yaml",
                        "/redis-test",
                        "/ping",
                        "/ws/**"
                ).permitAll()

                // everything else requires JWT
                .anyRequest().authenticated()
            )

            // Rate limit filter FIRST
            .addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class)

            // JWT filter
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