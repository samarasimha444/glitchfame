package com.example.backend.config.redis;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.backend.config.redis.rateLimiting.IPUtils;

import java.io.IOException;
import java.time.Duration;

@Component
@RequiredArgsConstructor
public class RateLimitingFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redis;

    private static final int LIMIT = 5; // max requests
    private static final Duration WINDOW = Duration.ofMinutes(1); // per minute

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // only limit /auth endpoints
        if (!path.equals("/auth/login") && !path.equals("/auth/signup")) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = IPUtils.getClientIp(request);

        String key = "rate:auth:" + ip;

        Long count = redis.opsForValue().increment(key);

        if (count != null && count == 1) {
            redis.expire(key, WINDOW);
        }

        if (count != null && count > LIMIT) {
            response.setStatus(429);
            response.getWriter().write("Too many requests. Try again later.");
            return;
        }

        filterChain.doFilter(request, response);
    }
}