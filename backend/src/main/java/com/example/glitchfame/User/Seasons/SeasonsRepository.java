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

//find all /live/upcoming based on the parameters

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
            ELSE CAST(p.status AS TEXT)
        END AS participationStatus
    FROM seasons s
    LEFT JOIN participations p
        ON p.season_id = s.id
        AND p.user_id = :userId
    WHERE
        (
            (:type = 'all' AND 
                (CURRENT_TIMESTAMP BETWEEN s.registration_start_date AND s.voting_end_date
                 OR CURRENT_TIMESTAMP < s.registration_start_date))
        OR
            (:type = 'live' AND 
                CURRENT_TIMESTAMP BETWEEN s.registration_start_date AND s.voting_end_date)
        OR
            (:type = 'upcoming' AND 
                CURRENT_TIMESTAMP < s.registration_start_date)
        )
    ORDER BY s.registration_start_date ASC
""", nativeQuery = true)
List<SeasonsDTO> findSeasons(
        @Param("userId") Long userId,
        @Param("type") String type
);



//get season by id
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
        COALESCE(CAST(p.status AS TEXT), 'NOT_PARTICIPATED') AS participationStatus
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
    WHERE s.name ILIKE :name || '%'
    AND CURRENT_TIMESTAMP BETWEEN s.registration_start_date AND s.voting_end_date
    ORDER BY s.name ASC
    LIMIT 10
""", nativeQuery = true)
List<SeasonsByNameDTO> searchLiveByName(
        @Param("name") String name
);
}