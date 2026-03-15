package com.example.backend.auth.admin;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PatchMapping("/{authId}/toggle-vote")
    public boolean toggleVote(@PathVariable UUID authId) {
        return adminAuthService.toggleVotePermission(authId);
    }

    @PatchMapping("/{authId}/toggle-participation")
    public boolean toggleParticipation(@PathVariable UUID authId) {
        return adminAuthService.toggleParticipationPermission(authId);
    }
}