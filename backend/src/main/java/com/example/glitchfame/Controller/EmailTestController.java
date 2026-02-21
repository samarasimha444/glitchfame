package com.example.glitchfame.Controller;

import com.example.glitchfame.Service.AuthService.EmailService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class EmailTestController {

    private final EmailService emailService;

    public EmailTestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/email")
    public String testEmail() {

        emailService.sendHtmlEmail(
                "samarasimha124@gmail.com",
                "GlitchFame Email Test",
                "<h2>It works 🚀</h2><p>SendGrid integrated successfully.</p>"
        );

        return "Email triggered";
    }
}