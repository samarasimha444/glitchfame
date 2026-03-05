package com.example.glitchfame.Auth.Service.emails;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
     public void sendEmail(String to, String subject, String body) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);        // recipient
        message.setSubject(subject);  // email subject
        message.setText(body);    // email body

        mailSender.send(message); // send email
    }
}