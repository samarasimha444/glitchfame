package com.example.glitchfame.Configuration.redis.Cache;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
@RequiredArgsConstructor
public class SeasonCacheListener {

    private final CacheManager cacheManager;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleSeasonChange(SeasonChangedEvent event) {
            if (cacheManager.getCache("dashboardSeasons") != null) {
            cacheManager.getCache("dashboardSeasons").clear();
        }
    }
}