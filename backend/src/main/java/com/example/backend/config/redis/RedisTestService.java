package com.example.backend.config.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RedisTestService {

    private final StringRedisTemplate redis;

    public String testRedis() {

        redis.opsForValue().set("redis:test", "working"); // write to redis

        return redis.opsForValue().get("redis:test"); // read from redis
    }
}