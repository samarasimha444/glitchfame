package com.example.glitchfame;




import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class Main {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "admin";

        String hash = encoder.encode(password);

        System.out.println(hash);
    }
}