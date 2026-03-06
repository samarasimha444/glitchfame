package com.example.glitchfame.User.Seasons;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import com.example.glitchfame.User.Seasons.DTO.SeasonDetailsDTO;
import com.example.glitchfame.User.Seasons.DTO.SeasonsByNameDTO;
import com.example.glitchfame.User.Seasons.DTO.SeasonsDTO;

import java.util.List;

public interface SeasonsRepository extends JpaRepository<Seasons, Long> {



    boolean existsByNameIgnoreCase(String name);

boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);


// ================= LIVE + UPCOMING SEASONS =================
@Query(value = """
    SELECT
        s.id AS seasonId,
        s.name AS seasonName,
        s.prize_money AS prizeMoney,
        s.photo_url AS seasonPhotoUrl,
        s.season_desc AS seasonDesc,
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
            NOW() BETWEEN s.registration_start_date AND s.voting_end_date
            OR
            NOW() < s.registration_start_date
        )
    ORDER BY s.registration_start_date ASC
""", nativeQuery = true)
List<SeasonsDTO> findLiveAndUpcomingSeasons(
        @Param("userId") Long userId
);


// ================= GET LIVE SEASONS =================
    @Query(value = """
        SELECT
            s.id AS seasonId,
            s.name AS seasonName,
            s.prize_money AS prizeMoney,
            s.photo_url AS seasonPhotoUrl,
            s.season_desc AS seasonDesc,
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
        WHERE NOW() BETWEEN s.registration_start_date AND s.voting_end_date
        ORDER BY s.voting_end_date DESC
    """, nativeQuery = true)
    List<SeasonsDTO> findLiveSeasons(@Param("userId") Long userId);


    // ================= GET SEASON DETAILS =================
    @Query(value = """
        SELECT
            s.id AS id,
            s.name AS name,
            s.prize_money AS prizeMoney,
            s.season_desc AS seasonDesc,
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


    // ================= SEARCH LIVE SEASONS BY NAME =================
    @Query(value = """
        SELECT
            s.id AS seasonId,
            s.name AS seasonName,
            s.photo_url AS photoUrl
        FROM seasons s
        WHERE s.name LIKE CONCAT(:name, '%')
        AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date
        ORDER BY s.name ASC
        LIMIT 10
    """, nativeQuery = true)
    List<SeasonsByNameDTO> searchLiveByName(
            @Param("name") String name
    );
}