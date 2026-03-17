package com.example.backend.participation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backend.participation.dto.ParticipantById;
import com.example.backend.participation.dto.Participants;

import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipationRepo extends JpaRepository<Participation, UUID> {

    // check if user already applied to a season
    Optional<Participation> findByAuthIdAndSeasonId(UUID authId, UUID seasonId);


    // LIVE contestants approved (all live seasons)
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
Page<Participants> findLiveContestants(
        @Param("authId") UUID authId,
        Pageable pageable
);


    

    // approved contestants of a specific season
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
    Page<Participants> findApprovedParticipants(
            @Param("seasonId") UUID seasonId,
            @Param("authId") UUID authId,
            Pageable pageable
    );





    // participant details by id
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
    ParticipantById findParticipantById(
            @Param("participationId") UUID participationId,
            @Param("authId") UUID authId
    );





    //search for participation by name (all live seasons)
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
Page<Participants> searchLiveApproved(
        @Param("name") String name,
        @Param("authId") UUID authId,
        Pageable pageable
);


    // search approved participants in a specific season
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
    Page<Participants> searchApprovedBySeason(
            @Param("seasonId") UUID seasonId,
            @Param("name") String name,
            @Param("authId") UUID authId,
            Pageable pageable
    );








@Query(value = """
SELECT p.*
FROM participation p
WHERE p.season_id = :seasonId
AND p.status = 'APPROVED'
""", nativeQuery = true)
List<Participation> findApprovedContestants(UUID seasonId);
}