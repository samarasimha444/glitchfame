package com.example.glitchfame.Seasons;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

import com.example.glitchfame.Seasons.DTO.SeasonDetailsDTO;
import com.example.glitchfame.Seasons.DTO.SeasonsByNameDTO;
import com.example.glitchfame.Seasons.DTO.SeasonsDTO;

public interface SeasonsRepository extends JpaRepository<Seasons, Long> {

    // Check if season name exists (case-insensitive)
    boolean existsByNameIgnoreCase(String name);

    // Check if season name exists for another season (exclude current ID)
    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);


    // Fetch seasons by dynamic status (UPCOMING, LIVE, PAST, or ALL) with participation info
    @Query(value = """
    SELECT
        s.id AS seasonId,
        s.name AS seasonName,
        s.prize_money AS prizeMoney,
        s.photo_url AS seasonPhotoUrl,
        s.registration_start_date AS registrationStartDate,
        s.registration_end_date AS registrationEndDate,
        s.voting_start_date AS votingStartDate,
        s.voting_end_date AS votingEndDate,
        s.vote_lock AS voteLock,
        s.participation_lock AS participationLock,
        s.season_lock AS seasonLock,
        CASE 
            WHEN p.id IS NULL THEN 'NOT_PARTICIPATED'
            ELSE p.status
        END AS participationStatus
    FROM seasons s
    LEFT JOIN participations p
        ON p.season_id = s.id
        AND p.user_id = :userId
    WHERE
        (
            :status IS NULL
            OR :status = ''
            OR
            (:status = 'UPCOMING' AND NOW() < s.registration_start_date)
            OR
            (:status = 'LIVE' AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date)
            OR
            (:status = 'PAST' AND NOW() > s.voting_end_date)
        )
    ORDER BY
        CASE 
            WHEN :status = 'UPCOMING' THEN s.registration_start_date
            WHEN :status = 'LIVE' THEN s.voting_end_date
            WHEN :status = 'PAST' THEN s.voting_end_date
            ELSE s.registration_start_date
        END DESC
    """, nativeQuery = true)
    List<SeasonsDTO> getSeasonsByStatus(
            @Param("status") String status,
            @Param("userId") Long userId
    );


    // Fetch detailed season information by ID including lock flags
    @Query(value = """
    SELECT
        s.id AS id,
        s.name AS name,
        s.prize_money AS prizeMoney,
        s.registration_start_date AS registrationStartDate,
        s.registration_end_date AS registrationEndDate,
        s.voting_start_date AS votingStartDate,
        s.voting_end_date AS votingEndDate,
        s.photo_url AS photoUrl,
        s.vote_lock AS voteLock,
        s.participation_lock AS participationLock,
        s.season_lock AS seasonLock,
        CASE
            WHEN p.id IS NULL THEN 'NOT_PARTICIPATED'
            ELSE p.status
        END AS participationStatus
    FROM seasons s
    LEFT JOIN participations p
        ON p.season_id = s.id
        AND p.user_id = :userId
    WHERE s.id = :seasonId
    """, nativeQuery = true)
    SeasonDetailsDTO findSeasonDetailsById(
            @Param("seasonId") Long seasonId,
            @Param("userId") Long userId
    );


    // Autocomplete search by season name filtered by status
    @Query(value = """
    SELECT
        s.id AS seasonId,
        s.name AS seasonName,
        s.photo_url AS photoUrl
    FROM seasons s
    WHERE
        s.name LIKE CONCAT(:name, '%')
        AND
        (
            (:status = 'UPCOMING' AND NOW() < s.registration_start_date)
            OR
            (:status = 'LIVE' AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date)
            OR
            (:status = 'PAST' AND NOW() > s.voting_end_date)
        )
    ORDER BY s.name ASC
    LIMIT 10
    """, nativeQuery = true)
    List<SeasonsByNameDTO> findSeasonsByNameContaining(
            @Param("name") String name,
            @Param("status") String status
    );

}