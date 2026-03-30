package com.example.backend.votes.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface VoteRepo extends JpaRepository<Vote, UUID> {

    // 🔍 Optional read (only if needed for debugging / analytics)
    Optional<Vote> findByParticipationIdAndAuthId(
            UUID participationId,
            UUID authId
    );

    // ❌ DELETE state (used for UNVOTE / UNKILL)
    @Modifying
    @Transactional
    void deleteByParticipationIdAndAuthId(
            UUID participationId,
            UUID authId
    );

    // 🔥 UPSERT (core of your system)
    @Modifying
    @Transactional
    @Query(value = """
        INSERT INTO votes (participation_id, auth_id, action)
        VALUES (:participationId, :authId, :action)
        ON CONFLICT (participation_id, auth_id)
        DO UPDATE SET action = EXCLUDED.action
    """, nativeQuery = true)
    void upsert(@Param("participationId") UUID participationId,
                @Param("authId") UUID authId,
                @Param("action") String action);
}