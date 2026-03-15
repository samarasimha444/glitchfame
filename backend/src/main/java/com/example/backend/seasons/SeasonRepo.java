package com.example.backend.seasons;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.seasons.dto.SeasonDetails;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface SeasonRepo extends JpaRepository<Season, UUID> {

    boolean existsByName(String name);


List<Season> findByVotingStartDateBeforeAndVotingEndDateAfter(
            Instant now1,
            Instant now2
    );

    //get seasons ALL/LIVE/UPCOMNG/PAST
    @Query("""
        SELECT
            s.seasonId as seasonId,
            s.name as seasonName,
            s.description as seasonDesc,
            s.photoUrl as seasonPhotoUrl,
             s.prize as prizeMoney,
            s.registrationStartDate as registrationStartDate,
            s.registrationEndDate as registrationEndDate,
            s.votingStartDate as votingStartDate,
            s.votingEndDate as votingEndDate,
            s.locked as seasonLock,
            CASE
                WHEN p.participationId IS NULL THEN 'PARTICIPATE_NOW'
                ELSE p.status
            END as participationStatus
        FROM Season s
        LEFT JOIN Participation p
            ON p.seasonId = s.seasonId
            AND p.authId = :authId
        WHERE
            (:type = 'ALL'
            OR (:type = 'LIVE'
                AND s.registrationStartDate <= :now
                AND s.votingEndDate >= :now)
            OR (:type = 'UPCOMING'
                AND :now < s.registrationStartDate)
            OR (:type = 'PAST'
                AND s.votingEndDate < :now)
            OR (:type = 'LIVE_UPCOMING'
                AND (
                    (s.registrationStartDate <= :now AND s.votingEndDate >= :now)
                    OR (:now < s.registrationStartDate)
                ))
            )
        """)
    Page<SeasonDetails> findSeasons(
            @Param("authId") UUID authId,
            @Param("type") String type,
            @Param("now") Instant now,
            Pageable pageable
    );






    //find season by season id
    @Query("""
        SELECT
            s.seasonId as seasonId,
            s.name as seasonName,
            s.description as seasonDesc,
            s.photoUrl as seasonPhotoUrl,
            s.prize as prizeMoney,
            s.registrationStartDate as registrationStartDate,
            s.registrationEndDate as registrationEndDate,
            s.votingStartDate as votingStartDate,
            s.votingEndDate as votingEndDate,
            s.locked as seasonLock,
            CASE
                WHEN p.participationId IS NULL THEN 'PARTICIPATE_NOW'
                ELSE p.status
            END as participationStatus
        FROM Season s
        LEFT JOIN Participation p
            ON p.seasonId = s.seasonId
            AND p.authId = :authId
        WHERE s.seasonId = :seasonId
        """)
    SeasonDetails findSeasonBySeasonId(
            @Param("seasonId") UUID seasonId,
            @Param("authId") UUID authId
    );
}