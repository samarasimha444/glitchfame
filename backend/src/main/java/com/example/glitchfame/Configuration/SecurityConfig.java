package com.example.glitchfame.Configuration;

import com.example.glitchfame.Configuration.jwt.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

    @Bean
     SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   JwtFilter jwtFilter) throws Exception {

        http
            .cors(cors -> {})   // 🔥 THIS ACTIVATES YOUR CORS CONFIG
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // allow preflight
                    .requestMatchers("/signup", "/login").permitAll()
                    .requestMatchers("/api/seasons/**").hasRole("ADMIN")
                    .requestMatchers(
                                     "/v3/api-docs/**",
                                                "/swagger-ui/**",
                                                 "/swagger-ui.html"
                                                                    ).permitAll()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}