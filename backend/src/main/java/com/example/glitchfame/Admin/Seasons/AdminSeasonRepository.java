package com.example.glitchfame.Admin.Seasons;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.example.glitchfame.User.Seasons.Seasons;
import com.example.glitchfame.User.Seasons.DTO.SeasonsDTO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminSeasonRepository extends JpaRepository<Seasons, Long> {


    boolean existsByNameIgnoreCase(String name);

boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    // ================= GET SEASONS BY STATUS =================
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
            s.season_lock AS seasonLock
        FROM seasons s
        WHERE
            (:status = 'ALL')
            OR (:status = 'UPCOMING' AND NOW() < s.registration_start_date)
            OR (:status = 'LIVE' AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date)
            OR (:status = 'PAST' AND NOW() > s.voting_end_date)
        ORDER BY s.registration_start_date DESC
    """,
    countQuery = """
        SELECT COUNT(*)
        FROM seasons s
        WHERE
            (:status = 'ALL')
            OR (:status = 'UPCOMING' AND NOW() < s.registration_start_date)
            OR (:status = 'LIVE' AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date)
            OR (:status = 'PAST' AND NOW() > s.voting_end_date)
    """,
    nativeQuery = true)
    Page<SeasonsDTO> findByStatus(
            @Param("status") String status,
            Pageable pageable
    );


    // ================= SEARCH BY NAME + STATUS =================
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
            s.season_lock AS seasonLock
        FROM seasons s
        WHERE s.name LIKE CONCAT('%', :name, '%')
        AND (
            (:status = 'ALL')
            OR (:status = 'UPCOMING' AND NOW() < s.registration_start_date)
            OR (:status = 'LIVE' AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date)
            OR (:status = 'PAST' AND NOW() > s.voting_end_date)
        )
        ORDER BY s.name ASC
    """,
    countQuery = """
        SELECT COUNT(*)
        FROM seasons s
        WHERE s.name LIKE CONCAT('%', :name, '%')
        AND (
            (:status = 'ALL')
            OR (:status = 'UPCOMING' AND NOW() < s.registration_start_date)
            OR (:status = 'LIVE' AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date)
            OR (:status = 'PAST' AND NOW() > s.voting_end_date)
        )
    """,
    nativeQuery = true)
    Page<SeasonsDTO> searchByNameAndStatus(
            @Param("name") String name,
            @Param("status") String status,
            Pageable pageable
    );




//season lock based on time
@Query(value = """
SELECT * FROM seasons
WHERE voting_end_date <= NOW()
AND season_lock = false
""", nativeQuery = true)
List<Seasons> findSeasonsToFinalize();

  
}