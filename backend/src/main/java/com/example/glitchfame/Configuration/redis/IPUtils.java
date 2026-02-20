package com.example.glitchfame.Configuration.redis;

import jakarta.servlet.http.HttpServletRequest;

public class IPUtils {

    private IPUtils() {}

    public static String getClientIP(HttpServletRequest request) {

        String xfHeader = request.getHeader("X-Forwarded-For");

        if (xfHeader == null || xfHeader.isBlank()) {
            return request.getRemoteAddr();
        }

        return xfHeader.split(",")[0].trim();
    }
}