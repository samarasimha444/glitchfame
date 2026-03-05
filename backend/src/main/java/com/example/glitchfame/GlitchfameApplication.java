package com.example.glitchfame;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;



@EnableScheduling
@EnableCaching
@SpringBootApplication
public class GlitchfameApplication {
        public static void main(String[] args) {
		SpringApplication.run(GlitchfameApplication.class, args);
	}

}
