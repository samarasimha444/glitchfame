package com.example.glitchfame.Configuration.WebSockets;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import com.example.glitchfame.Configuration.jwt.JwtUtil;

@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader =
                    accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String token = authHeader.substring(7);

                if (!jwtService.validateToken(token)) {
                    throw new IllegalArgumentException("Invalid JWT");
                }

                Long userId = jwtService.extractUserId(token);
                accessor.setUser(() -> userId.toString());
            } else {
                throw new IllegalArgumentException("Missing Authorization header");
            }
        }

        return message;
    }
}