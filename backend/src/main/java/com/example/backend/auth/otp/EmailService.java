package com.example.backend.auth.otp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.*;

@Service
public class  EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // core email sender
    public void sendEmail(String to, String subject, String html) {

        String url = "https://api.resend.com/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey); // resend api key
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String,Object> body = new HashMap<>();
        body.put("from", "GlitchFame <noreply@rentafellow.in>"); // verified domain
        body.put("to", List.of(to));
        body.put("subject", subject);
        body.put("html", html);

        HttpEntity<Map<String,Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(url, request, String.class);
    }

    // OTP email sender
    public void sendOtpEmail(String email, String otp, String type) {

        String subject;
        String html;

        if(type.equals("REGISTER")) {

            subject = "Verify your email - GlitchFame";

            html =
                    "<div style='font-family:sans-serif'>" +
                    "<h2>Email Verification</h2>" +
                    "<p>Your OTP is:</p>" +
                    "<h1>" + otp + "</h1>" +
                    "<p>This OTP expires in 5 minutes.</p>" +
                    "</div>";

        } else {

            subject = "Reset Password - GlitchFame";

            html =
                    "<div style='font-family:sans-serif'>" +
                    "<h2>Password Reset</h2>" +
                    "<p>Your OTP is:</p>" +
                    "<h1>" + otp + "</h1>" +
                    "<p>This OTP expires in 5 minutes.</p>" +
                    "</div>";
        }

        sendEmail(email, subject, html);
    }
}