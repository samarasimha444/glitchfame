package com.example.backend.config;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();

        executor.setCorePoolSize(10);      // always alive threads
        executor.setMaxPoolSize(50);       // max threads under load
        executor.setQueueCapacity(500);    // waiting tasks

        executor.setThreadNamePrefix("async-");

        // 🔥 important (prevents silent task rejection crash)
        executor.setRejectedExecutionHandler((r, exec) -> {
            throw new RuntimeException("Too many async tasks - system overloaded");
        });

        executor.initialize();
        return executor;
    }
}
    

