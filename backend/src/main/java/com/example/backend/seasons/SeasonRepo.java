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

    // 🔥 GET SEASONS (JWT OPTIONAL)
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
                WHEN :authId IS NULL THEN 'PARTICIPATE_NOW'
                WHEN p.participationId IS NULL THEN 'PARTICIPATE_NOW'
                ELSE p.status
            END as participationStatus
        FROM Season s
        LEFT JOIN Participation p
            ON p.seasonId = s.seasonId
            AND (:authId IS NOT NULL AND p.authId = :authId)
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

    // 🔥 GET SEASON BY ID (JWT OPTIONAL)
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
                WHEN :authId IS NULL THEN 'PARTICIPATE_NOW'
                WHEN p.participationId IS NULL THEN 'PARTICIPATE_NOW'
                ELSE p.status
            END as participationStatus
        FROM Season s
        LEFT JOIN Participation p
            ON p.seasonId = s.seasonId
            AND (:authId IS NOT NULL AND p.authId = :authId)
        WHERE s.seasonId = :seasonId
        """)
    SeasonDetails findSeasonBySeasonId(
            @Param("seasonId") UUID seasonId,
            @Param("authId") UUID authId
    );

    List<Season> findByVotingEndDateBefore(Instant now);

//get random live season
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

        COUNT(pApproved.participationId) as totalParticipants,

        CASE
            WHEN :authId IS NULL THEN 'PARTICIPATE_NOW'
            WHEN pUser.participationId IS NULL THEN 'PARTICIPATE_NOW'
            ELSE pUser.status
        END as participationStatus

    FROM Season s

    
    LEFT JOIN Participation pUser
        ON pUser.seasonId = s.seasonId
        AND pUser.authId = :authId

    
    LEFT JOIN Participation pApproved
        ON pApproved.seasonId = s.seasonId
        AND pApproved.status = 'APPROVED'

    WHERE s.votingStartDate <= :now
      AND s.votingEndDate >= :now

    GROUP BY
        s.seasonId,
        s.name,
        s.description,
        s.photoUrl,
        s.prize,
        s.registrationStartDate,
        s.registrationEndDate,
        s.votingStartDate,
        s.votingEndDate,
        s.locked,
        pUser.participationId,
        pUser.status

    ORDER BY COUNT(pApproved.participationId) DESC
""")
Page<SeasonDetails> findRandomLiveSeason(
        @Param("authId") UUID authId,
        @Param("now") Instant now,
        Pageable pageable
);




    // for schedulers
    List<Season> findByVotingEndDateBeforeAndSeasonEndedFalse(Instant now);
}