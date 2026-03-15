package com.example.backend.config.security.jwt;

import jakarta.servlet.FilterChain; // servlet filter chain
import jakarta.servlet.ServletException; // servlet exception
import jakarta.servlet.http.HttpServletRequest; // incoming request
import jakarta.servlet.http.HttpServletResponse; // outgoing response

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // auth token
import org.springframework.security.core.authority.SimpleGrantedAuthority; // role authority
import org.springframework.security.core.context.SecurityContextHolder; // security context
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource; // request details
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil; // jwt utility

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization"); // read auth header

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // continue if no token
            return;
        }

        String token = header.substring(7); // remove "Bearer "

        if (!jwtUtil.validateToken(token)) {
            filterChain.doFilter(request, response); // continue if invalid
            return;
        }

        UUID authId = jwtUtil.extractAuthId(token); // extract uuid
        String role = jwtUtil.extractRole(token); // extract role

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        authId, // principal
                        null, // credentials
                        List.of(new SimpleGrantedAuthority(role)) // authorities
                );

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication); // set auth

        filterChain.doFilter(request, response); // continue request
    }
}