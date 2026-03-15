/*

package com.example.backend;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisCleaner {

    private final StringRedisTemplate redisTemplate;

    @PostConstruct
    public void clearRedis() { // runs once at startup
        redisTemplate.getConnectionFactory()
                .getConnection()
                .serverCommands()
                .flushAll(); // clears redis

        System.out.println("Redis cleared");
    }
}

 */