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

    private static final String ALL_SEASONS_KEY = "seasons:all";

    

    // ✅ register ONLY core keys (call in SeasonService, not VoteService)
    public void registerSeasonKey(UUID seasonId, String key) {

        String registryKey = "season:" + seasonId + ":keys";

        // check BEFORE adding (important)
        Boolean exists = redis.hasKey(registryKey);

        // add key to season registry
        redis.opsForSet().add(registryKey, key);

        // add season to global set ONLY once
        if (Boolean.FALSE.equals(exists)) {
            redis.opsForSet().add(ALL_SEASONS_KEY, seasonId.toString());
        }
    }

    // ✅ get all season IDs from Redis
    public Set<String> getAllSeasonIds() {
        Set<String> seasons = redis.opsForSet().members(ALL_SEASONS_KEY);
        return seasons != null ? seasons : Set.of();
    }

    // ✅ delete ALL Redis data for a season (safe cleanup)
    public void deleteSeasonData(UUID seasonId) {

        String registryKey = "season:" + seasonId + ":keys";

        // 1. delete core keys (leaderboard, lock, etc.)
        Set<String> keys = redis.opsForSet().members(registryKey);
        if (keys != null && !keys.isEmpty()) {
            redis.delete(keys);
        }

        // 2. delete ALL user vote keys (pattern-based, OK for admin cleanup)
        Set<String> userKeys = redis.keys("votes:user:" + seasonId + ":*");
        if (userKeys != null && !userKeys.isEmpty()) {
            redis.delete(userKeys);
        }

        // 3. delete registry itself
        redis.delete(registryKey);

        // 4. remove season from global registry
        redis.opsForSet().remove(ALL_SEASONS_KEY, seasonId.toString());
    }
}