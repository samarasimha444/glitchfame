package com.example.backend.config.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RedisService {

    private final StringRedisTemplate redis;

    private String registry(UUID seasonId) {
        return "sr:" + seasonId;
    }

    // 🔥 register key
    public void register(UUID seasonId, String key) {
        redis.opsForSet().add(registry(seasonId), key);
    }

    // 🔥 delete full season (NO stale data)
    public void deleteSeason(UUID seasonId) {
        String reg = registry(seasonId);

        Set<String> keys = redis.opsForSet().members(reg);
        if (keys != null && !keys.isEmpty()) {
            redis.delete(keys);
        }

        redis.delete(reg);
    }
}