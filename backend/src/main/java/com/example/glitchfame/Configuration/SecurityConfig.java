package com.example.glitchfame.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import com.example.glitchfame.Configuration.jwt.JwtFilter;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityConfig {

   @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http,
                                               JwtFilter jwtFilter) throws Exception {

    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
                .requestMatchers("/signup", "/login").permitAll()
                .requestMatchers("/api/seasons/**").hasRole("ADMIN")
                .anyRequest().authenticated()
        )
        .addFilterBefore(jwtFilter,
                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
 @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10); // cost factor 10
    }
}