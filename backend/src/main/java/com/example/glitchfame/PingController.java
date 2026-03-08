package com.example.glitchfame;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class PingController {

    @GetMapping("/ping")
    public String getMethodName() {
        return "pong";
       
    }
    
    
}
