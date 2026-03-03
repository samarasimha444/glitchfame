package com.example.glitchfame.User.Contestants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.glitchfame.User.Contestants.DTO.ContestantByName;
import com.example.glitchfame.User.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.User.Contestants.DTO.SeasonContestants;

import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface ContestantRepository extends JpaRepository<Participation, Long> {

   
   
boolean existsByUserIdAndSeasonId(Long userId, Long seasonId);
boolean existsByIdAndUserId(Long id, Long userId);
void deleteByIdAndUserId(Long id, Long userId);



    //get contestant by id
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

            COUNT(DISTINCT v.id) AS voteCount,

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

        WHERE p.id = :id

        GROUP BY 
            p.id, s.id
    """, nativeQuery = true)
    Optional<ContestantsDTO> getContestantById(
            @Param("id") Long id,
            @Param("userId") Long userId
    );






   //all contestants(live and only approved ones)
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

            COUNT(DISTINCT v.id) AS voteCount,

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

        WHERE p.status = 'APPROVED'
        AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date

        GROUP BY 
            p.id, s.id

        ORDER BY voteCount DESC
    """,
    countQuery = """
        SELECT COUNT(*)
        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        WHERE p.status = 'APPROVED'
        AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date
    """,
    nativeQuery = true)
    Page<ContestantsDTO> findApprovedLive(
            @Param("userId") Long userId,
            Pageable pageable
    );






   //search by name
    @Query(value = """
    SELECT 
        p.id AS id,
        p.name AS name,
        p.photo_url AS photoUrl
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    WHERE p.status = 'APPROVED'
    AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date
    AND (:name IS NULL OR p.name LIKE CONCAT('%', :name, '%'))
    ORDER BY p.name ASC
""",
countQuery = """
    SELECT COUNT(*)
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    WHERE p.status = 'APPROVED'
    AND NOW() BETWEEN s.registration_start_date AND s.voting_end_date
    AND (:name IS NULL OR p.name LIKE CONCAT('%', :name, '%'))
""",
nativeQuery = true)
Page<ContestantByName> searchByName(
        @Param("name") String name,
        Pageable pageable
);





//contestants of a season
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

    GROUP BY 
        p.id,
        s.id,
        av.admin_vote_count

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




//search for contestant by name in  a season(id)
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
    AND (:name IS NULL OR p.name LIKE CONCAT('%', :name, '%'))

    GROUP BY 
        p.id,
        s.id,
        av.admin_vote_count

    ORDER BY totalVotes DESC
""",
countQuery = """
    SELECT COUNT(*)
    FROM participations p
    WHERE p.season_id = :seasonId
    AND p.status = 'APPROVED'
    AND (:name IS NULL OR p.name LIKE CONCAT('%', :name, '%'))
""",
nativeQuery = true)
Page<SeasonContestants> searchSeasonContestantsByName(
        @Param("seasonId") Long seasonId,
        @Param("name") String name,
        @Param("userId") Long userId,
        Pageable pageable
);


























}