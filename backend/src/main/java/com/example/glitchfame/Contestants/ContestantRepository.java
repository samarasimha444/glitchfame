package com.example.glitchfame.Contestants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;


@Repository
public interface ContestantRepository extends JpaRepository<Participation, Long> {

    
    //user exist or not
    boolean existsByUserIdAndSeasonId(Long userId, Long seasonId);


    //delete particiation
    void deleteById(Long id);


    
    //get parcipant by id
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

            COALESCE(COUNT(v.id),0) + COALESCE(av.admin_vote_count,0) AS voteCount,

            CASE 
                WHEN :userId IS NOT NULL AND EXISTS (
                    SELECT 1 FROM votes v2
                    WHERE v2.contestant_id = p.id
                    AND v2.voter_id = :userId
                )
                THEN 1 ELSE 0
            END AS hasVoted

        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        LEFT JOIN votes v ON v.contestant_id = p.id
        LEFT JOIN admin_votes av ON av.participation_id = p.id

        WHERE p.id = :id

        GROUP BY 
            p.id, p.name, p.photo_url, p.date_of_birth,
            p.location, p.description, p.status, p.created_at, p.user_id,
            s.id, s.name, s.prize_money, s.photo_url,
            s.registration_start_date, s.registration_end_date,
            s.voting_start_date, s.voting_end_date,
            av.admin_vote_count
    """, nativeQuery = true)
    Optional<ContestantsDTO> getContestantById(
            @Param("id") Long id,
            @Param("userId") Long userId
    );


  
//flexible query based on seasons/status/names
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

            COALESCE(COUNT(v.id),0) + COALESCE(av.admin_vote_count,0) AS voteCount,

            CASE 
                WHEN :userId IS NOT NULL AND EXISTS (
                    SELECT 1 FROM votes v2
                    WHERE v2.contestant_id = p.id
                    AND v2.voter_id = :userId
                )
                THEN 1 ELSE 0
            END AS hasVoted

        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        LEFT JOIN votes v ON v.contestant_id = p.id
        LEFT JOIN admin_votes av ON av.participation_id = p.id

        WHERE
            (:seasonId IS NULL OR p.season_id = :seasonId)
        AND (:name IS NULL OR p.name LIKE CONCAT('%', :name, '%'))
        AND (:status = 'ALL' OR p.status = :status)
        AND (
                :liveOnly = FALSE 
                OR NOW() BETWEEN s.registration_start_date AND s.voting_end_date
            )

        GROUP BY 
            p.id, p.name, p.photo_url, p.date_of_birth,
            p.location, p.description, p.status, p.created_at, p.user_id,
            s.id, s.name, s.prize_money, s.photo_url,
            s.registration_start_date, s.registration_end_date,
            s.voting_start_date, s.voting_end_date,
            av.admin_vote_count

        ORDER BY voteCount DESC
    """,
    countQuery = """
        SELECT COUNT(*)
        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        WHERE
            (:seasonId IS NULL OR p.season_id = :seasonId)
        AND (:name IS NULL OR p.name LIKE CONCAT('%', :name, '%'))
        AND (:status = 'ALL' OR p.status = :status)
        AND (
                :liveOnly = FALSE 
                OR NOW() BETWEEN s.registration_start_date AND s.voting_end_date
            )
    """,
    nativeQuery = true)
    Page<ContestantsDTO> findWithFilters(
            @Param("seasonId") Long seasonId,
            @Param("name") String name,
            @Param("status") String status,
            @Param("liveOnly") boolean liveOnly,
            @Param("userId") Long userId,
            Pageable pageable
    );

}