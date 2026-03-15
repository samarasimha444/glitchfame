package com.example.backend.auth.admin;

import com.example.backend.auth.Auth;
import com.example.backend.auth.AuthRepo;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AuthRepo authRepo;

    @Transactional
    public boolean toggleVotePermission(UUID authId) {

        Auth user = authRepo.findById(authId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setCanVote(!Boolean.TRUE.equals(user.getCanVote())); // toggle

        return user.getCanVote();
    }

    @Transactional
    public boolean toggleParticipationPermission(UUID authId) {

        Auth user = authRepo.findById(authId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setCanParticipate(!Boolean.TRUE.equals(user.getCanParticipate())); // toggle

        return user.getCanParticipate();
    }
}