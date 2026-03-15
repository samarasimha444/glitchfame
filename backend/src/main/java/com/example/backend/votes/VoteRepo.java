package com.example.backend.votes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import jakarta.transaction.Transactional;

import java.util.UUID;

public interface VoteRepo extends JpaRepository<Vote, UUID> {
boolean existsByParticipationIdAndAuthId(UUID participationId, UUID authId);

 @Modifying
    @Transactional
    int deleteByParticipationIdAndAuthId(UUID participationId, UUID authId);
}