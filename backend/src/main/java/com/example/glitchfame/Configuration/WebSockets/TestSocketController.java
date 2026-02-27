package com.example.glitchfame.Configuration.WebSockets;

import org.springframework.messaging.handler.annotation.MessageMapping;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import lombok.RequiredArgsConstructor;

 @RestController
@RequiredArgsConstructor
public class TestSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/test")
    public String sendTest() {

        messagingTemplate.convertAndSend(
                "/topic/test",
                "Hello from backend"
        );

        return "sent";
    }
} 
