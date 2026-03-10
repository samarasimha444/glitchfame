package com.example.glitchfame.Admin.Contestants;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.glitchfame.User.Contestants.Participation;
import com.example.glitchfame.User.Contestants.DTO.ContestantByName;
import com.example.glitchfame.User.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.User.Contestants.DTO.SeasonContestants;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;



public interface AdminContestantRepository extends JpaRepository<Participation, Long> {


// LIVE SEASONS FILTERED BY STATUS
@Query(value = """
    SELECT 
        p.id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        p.date_of_birth AS dateOfBirth,
        p.location AS location,
        p.description AS description,
        p.status AS status,
        p.created_at AS createdAt,
        p.user_id AS userId,

        s.id AS seasonId,
        s.name AS seasonName,
        s.prize_money AS prizeMoney,
        s.photo_url AS seasonPhotoUrl,
        s.registration_start_date AS registrationStartDate,
        s.registration_end_date AS registrationEndDate,
        s.voting_start_date AS votingStartDate,
        s.voting_end_date AS votingEndDate,

        COALESCE(COUNT(DISTINCT v.id),0) +
        CASE 
            WHEN p.status = 'APPROVED'
            THEN COALESCE(av.admin_vote_count,0)
            ELSE 0
        END AS voteCount

    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    LEFT JOIN votes v ON v.contestant_id = p.id
    LEFT JOIN admin_votes av ON av.participation_id = p.id

    WHERE 
        NOW() BETWEEN s.registration_start_date AND s.voting_end_date
    AND (:status IS NULL OR :status = 'ALL' OR p.status = :status)

    GROUP BY 
        p.id,
        s.id,
        av.admin_vote_count

    ORDER BY p.created_at DESC
""",
countQuery = """
    SELECT COUNT(DISTINCT p.id)
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    WHERE 
        NOW() BETWEEN s.registration_start_date AND s.voting_end_date
    AND (:status IS NULL OR :status = 'ALL' OR p.status = :status)
""",
nativeQuery = true)
Page<ContestantsDTO> findLiveSeasonContestantsByStatus(
        @Param("status") String status,
        Pageable pageable
);



    // APPROVED CONTESTANTS OF A SEASON WITH VOTES
    @Query(value = """
        SELECT 
            p.id AS id,
            p.user_id AS userId,
            p.season_id AS seasonId,
            p.name AS name,
            p.description AS description,
            p.status AS status,
            p.date_of_birth AS dateOfBirth,
            p.location AS location,
            p.photo_url AS photoUrl,

            s.name AS seasonName,
            s.prize_money AS prizeMoney,
            s.photo_url AS seasonPhotoUrl,
            s.registration_start_date AS registrationStartDate,
            s.registration_end_date AS registrationEndDate,
            s.voting_start_date AS votingStartDate,
            s.voting_end_date AS votingEndDate,

            COALESCE(COUNT(DISTINCT v.id),0) 
            + COALESCE(av.admin_vote_count,0) AS totalVotes,

            CASE 
                WHEN :userId IS NOT NULL 
                     AND EXISTS (
                         SELECT 1 
                         FROM votes v2
                         WHERE v2.contestant_id = p.id
                         AND v2.voter_id = :userId
                     )
                THEN 1 ELSE 0
            END AS hasVoted

        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        LEFT JOIN votes v ON v.contestant_id = p.id
        LEFT JOIN admin_votes av ON av.participation_id = p.id

        WHERE p.season_id = :seasonId
        AND p.status = 'APPROVED'

        GROUP BY p.id, s.id, av.admin_vote_count
        ORDER BY totalVotes DESC
    """,
    countQuery = """
        SELECT COUNT(*)
        FROM participations p
        WHERE p.season_id = :seasonId
        AND p.status = 'APPROVED'
    """,
    nativeQuery = true)
    Page<SeasonContestants> findApprovedSeasonContestantsWithVotes(
            @Param("seasonId") Long seasonId,
            @Param("userId") Long userId,
            Pageable pageable
    );



    // SEASON CONTESTANTS FILTERED BY STATUS
    @Query(value = """
        SELECT 
            p.id AS id,
            p.user_id AS userId,
            p.season_id AS seasonId,
            p.name AS name,
            p.description AS description,
            p.status AS status,
            p.date_of_birth AS dateOfBirth,
            p.location AS location,
            p.photo_url AS photoUrl,

            s.name AS seasonName,
            s.prize_money AS prizeMoney,
            s.photo_url AS seasonPhotoUrl,
            s.registration_start_date AS registrationStartDate,
            s.registration_end_date AS registrationEndDate,
            s.voting_start_date AS votingStartDate,
            s.voting_end_date AS votingEndDate,

            COALESCE(COUNT(DISTINCT v.id),0) 
            + COALESCE(av.admin_vote_count,0) AS totalVotes,

            CASE 
                WHEN :userId IS NOT NULL 
                     AND EXISTS (
                         SELECT 1 
                         FROM votes v2
                         WHERE v2.contestant_id = p.id
                         AND v2.voter_id = :userId
                     )
                THEN 1 ELSE 0
            END AS hasVoted

        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        LEFT JOIN votes v ON v.contestant_id = p.id
        LEFT JOIN admin_votes av ON av.participation_id = p.id

        WHERE p.season_id = :seasonId
        AND (:status IS NULL OR :status = 'ALL' OR p.status = :status)

        GROUP BY p.id, s.id, av.admin_vote_count
        ORDER BY p.created_at DESC
    """,
    countQuery = """
        SELECT COUNT(*)
        FROM participations p
        WHERE p.season_id = :seasonId
        AND (:status IS NULL OR :status = 'ALL' OR p.status = :status)
    """,
    nativeQuery = true)
    Page<SeasonContestants> findSeasonContestantsByStatus(
            @Param("seasonId") Long seasonId,
            @Param("status") String status,
            @Param("userId") Long userId,
            Pageable pageable
    );


   //reset season
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM participations WHERE season_id = :seasonId", nativeQuery = true)
    void resetSeason(Long seasonId);


    //unfied global search

    // UNIFIED SEARCH (ALL COMBINATIONS SUPPORTED)
@Query(value = """
    SELECT
        p.id AS id,
        p.name AS name,
        p.photo_url AS photoUrl
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    WHERE
        (:seasonId IS NULL OR p.season_id = :seasonId)

    AND (
            :seasonType IS NULL
         OR :seasonType = 'ALL'
         OR (:seasonType = 'LIVE'
             AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date)
         OR (:seasonType = 'PAST'
             AND NOW() > s.voting_end_date)
         OR (:seasonType = 'FUTURE'
             AND NOW() < s.registration_start_date)
        )

    AND (:status IS NULL OR :status = 'ALL' OR p.status = :status)

    AND (:name IS NULL OR p.name ILIKE '%' || :name || '%')

    ORDER BY p.name ASC
""",
countQuery = """
    SELECT COUNT(*)
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    WHERE
        (:seasonId IS NULL OR p.season_id = :seasonId)

    AND (
            :seasonType IS NULL
         OR :seasonType = 'ALL'
         OR (:seasonType = 'LIVE'
             AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date)
         OR (:seasonType = 'PAST'
             AND NOW() > s.voting_end_date)
         OR (:seasonType = 'FUTURE'
             AND NOW() < s.registration_start_date)
        )

    AND (:status IS NULL OR :status = 'ALL' OR p.status = :status)

    AND (:name IS NULL OR p.name ILIKE '%' || :name || '%')
""",
nativeQuery = true)
Page<ContestantByName> searchContestants(
        @Param("seasonId") Long seasonId,
        @Param("seasonType") String seasonType,
        @Param("status") String status,
        @Param("name") String name,
        Pageable pageable
);

}