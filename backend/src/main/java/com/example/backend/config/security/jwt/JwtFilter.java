package com.example.backend.config.security.jwt;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
import java.util.UUID;



@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        boolean isGet = "GET".equalsIgnoreCase(request.getMethod());

        // ✅ No token → just continue (public request)
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        // 🔴 Invalid / expired token
        if (!jwtUtil.validateToken(token)) {

            if (isGet) {
                // ✅ ignore invalid token for GET → treat as guest
                filterChain.doFilter(request, response);
                return;
            }

            sendUnauthorized(response, "Token expired. Please login again.");
            return;
        }

        UUID authId = jwtUtil.extractAuthId(token);
        String role = jwtUtil.extractRole(token);

        // 🔴 Redis session check
        String storedToken = redisTemplate.opsForValue()
                .get("user:" + authId);

        if (storedToken == null) {

            if (isGet) {
                filterChain.doFilter(request, response);
                return;
            }

            sendUnauthorized(response, "Session expired. Please login again.");
            return;
        }

        if (!storedToken.equals(token)) {

            if (isGet) {
                filterChain.doFilter(request, response);
                return;
            }

            sendUnauthorized(response, "Logged in from another device. Please login again.");
            return;
        }

        // ✅ Set authentication (only if valid)
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        authId,
                        null,
                        List.of(new SimpleGrantedAuthority(role))
                );

        authentication.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }

    // 🔥 centralized 401 response
    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");

        response.getWriter().write("""
            {
                "status": 401,
                "message": "%s"
            }
        """.formatted(message));
    }
}