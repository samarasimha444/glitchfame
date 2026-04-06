package com.example.backend.config.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private final String SECRET = "supersecuresecretkeysupersecuresecretkey"; // change in prod
    private final long EXPIRATION = 1000 * 60 * 60 * 24; // 7 days

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes()); // create signing key
    }

    // generate token
    public String generateToken(UUID authId, String role) {

        return Jwts.builder()
                .claim("auth_id", authId.toString()) // store UUID
                .claim("role", role) // store role
                .setIssuedAt(new Date()) // issued time
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION)) // expiry
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // signing
                .compact();
    }

    // extract auth id
    public UUID extractAuthId(String token) {

        Claims claims = extractAllClaims(token);
        return UUID.fromString(claims.get("auth_id", String.class)); // convert back to UUID
    }

    // extract role
    public String extractRole(String token) {

        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    // check token validity
    public boolean validateToken(String token) {

        try {
            extractAllClaims(token); // will throw if invalid
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // parse token
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // verify signature
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}