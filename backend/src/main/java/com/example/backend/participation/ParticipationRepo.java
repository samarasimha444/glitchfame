package com.example.backend.participation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.participation.dto.ParticipantById;
import com.example.backend.participation.dto.TrackMyApplications;
import com.example.backend.participation.dto.base.ParticipantByIdBase;
import com.example.backend.participation.dto.base.ParticipantsBase;

import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipationRepo extends JpaRepository<Participation, UUID> {

    Optional<Participation> findByAuthIdAndSeasonId(UUID authId, UUID seasonId);

    // ================= LIVE =================
    @Query(value = """
    SELECT
        p.participation_id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        p.season_id AS seasonId
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = 'APPROVED'
    AND s.voting_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    """,
    countQuery = """
    SELECT COUNT(*)
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = 'APPROVED'
    AND s.voting_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    """,
    nativeQuery = true)
    Page<ParticipantsBase> findLiveContestants(Pageable pageable); // ✅ FIXED

    // ================= BY SEASON =================
    @Query(value = """
        SELECT
            p.participation_id AS participationId,
            p.name AS participantName,
            p.photo_url AS participantPhotoUrl,
            p.season_id AS seasonId
        FROM participation p
        WHERE p.season_id = :seasonId
        AND p.status = 'APPROVED'
        """,
        countQuery = """
        SELECT COUNT(*)
        FROM participation p
        WHERE p.season_id = :seasonId
        AND p.status = 'APPROVED'
        """,
        nativeQuery = true)
    Page<ParticipantsBase> findApprovedParticipants(
            @Param("seasonId") UUID seasonId,
            Pageable pageable
    ); // ✅ FIXED

    // ================= SEARCH LIVE =================
    @Query(value = """
    SELECT
        p.participation_id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        p.season_id AS seasonId
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = 'APPROVED'
    AND p.name ILIKE '%' || :name || '%'
    AND s.voting_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    """,
    countQuery = """
    SELECT COUNT(*)
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = 'APPROVED'
    AND p.name ILIKE '%' || :name || '%'
    AND s.voting_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    """,
    nativeQuery = true)
    Page<ParticipantsBase> searchLiveApproved(
            @Param("name") String name,
            Pageable pageable
    ); // ✅ FIXED

    // ================= SEARCH BY SEASON =================
    @Query(value = """
        SELECT
            p.participation_id AS participationId,
            p.name AS participantName,
            p.photo_url AS participantPhotoUrl,
            p.season_id AS seasonId
        FROM participation p
        WHERE p.season_id = :seasonId
        AND p.status = 'APPROVED'
        AND p.name ILIKE '%' || :name || '%'
        """,
        countQuery = """
        SELECT COUNT(*)
        FROM participation p
        WHERE p.season_id = :seasonId
        AND p.status = 'APPROVED'
        AND p.name ILIKE '%' || :name || '%'
        """,
        nativeQuery = true)
    Page<ParticipantsBase> searchApprovedBySeason(
            @Param("seasonId") UUID seasonId,
            @Param("name") String name,
            Pageable pageable
    ); // ✅ FIXED

    // ================= BY ID =================
    @Query(value = """
        SELECT
            p.participation_id AS participationId,
            p.name AS participantName,
            p.photo_url AS participantPhotoUrl,
            p.date_of_birth AS dateOfBirth,
            p.location AS location,
            p.description AS description,
            p.status AS status,
            p.season_id AS seasonId,

            s.name AS seasonName,
            s.prize AS prizeMoney,
            s.photo_url AS seasonPhotoUrl,
            s.registration_start_date AS registrationStartDate,
            s.registration_end_date AS registrationEndDate,
            s.voting_start_date AS votingStartDate,
            s.voting_end_date AS votingEndDate

        FROM participation p
        JOIN season s ON s.season_id = p.season_id
        WHERE p.participation_id = :participationId
        """,
        nativeQuery = true)
    ParticipantByIdBase findParticipantById(
            @Param("participationId") UUID participationId
    );




    // ================= RAW LIST =================
    @Query(value = """
    SELECT p.*
    FROM participation p
    WHERE p.season_id = :seasonId
    AND p.status = 'APPROVED'
    """, nativeQuery = true)
    List<Participation> findApprovedContestants(@Param("seasonId") UUID seasonId);



    

  @Query(value = """
SELECT
    p.participation_id AS participationId,
    p.season_id AS seasonId,

    p.name AS participantName,
    p.photo_url AS participantPhotoUrl,
    p.status AS status,

    s.name AS seasonName,
    s.registration_start_date AS registrationStartDate,
    s.registration_end_date AS registrationEndDate,
    s.voting_start_date AS votingStartDate,
    s.voting_end_date AS votingEndDate,

    p.votes AS votes,
    p.kills AS kills,
    p.score AS score,
    p.rank AS rank

FROM participation p
JOIN season s ON s.season_id = p.season_id
WHERE p.auth_id = :authId
ORDER BY p.modified_at DESC
""",
countQuery = """
SELECT COUNT(*)
FROM participation p
WHERE p.auth_id = :authId
""",
nativeQuery = true)
Page<TrackMyApplications> findMyApplications(
        @Param("authId") UUID authId,
        Pageable pageable
);
}