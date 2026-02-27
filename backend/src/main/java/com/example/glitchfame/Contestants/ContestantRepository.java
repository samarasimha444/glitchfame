package com.example.glitchfame.Contestants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import java.util.List;
import com.example.glitchfame.Contestants.DTO.ContestantsStatusDTO;
import com.example.glitchfame.Contestants.DTO.SeasonContestants;
import org.springframework.data.repository.query.Param;
import com.example.glitchfame.Contestants.DTO.ContestantByName;
import java.util.Optional;











@Repository
public interface ContestantRepository extends JpaRepository<Participation, Long> {

 //check whether a user has already applied for a season
boolean existsByUserIdAndSeasonId(Long userId, Long seasonId);



//get all approved contestants with vote count and whether the user has voted for them or not, order by vote count descending
@Query(value = """
    SELECT 
        p.id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.photo_url AS seasonPhotoUrl,
        p.date_of_birth AS dateOfBirth,
        p.location AS location,
        p.description AS description,
        p.user_id AS userId,
        s.id AS seasonId,
        s.name AS seasonName,
        s.prize_money AS prizeMoney,
        s.registration_start_date AS registrationStartDate,
        s.registration_end_date AS registrationEndDate,
        s.voting_start_date AS votingStartDate,
        s.voting_end_date AS votingEndDate,
        COUNT(v.id) AS voteCount,
        EXISTS (
            SELECT 1 
            FROM votes v2 
            WHERE v2.contestant_id = p.id 
            AND v2.voter_id = :userId
        ) AS hasVoted
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    LEFT JOIN votes v ON v.contestant_id = p.id
    WHERE p.status = 'APPROVED'
    GROUP BY 
        p.id, p.name, p.photo_url, p.date_of_birth, 
        p.location, p.description, p.user_id,
        s.id, s.name, s.prize_money, s.photo_url,
        s.registration_start_date,
        s.registration_end_date,
        s.voting_start_date,
        s.voting_end_date
    ORDER BY voteCount DESC
""", nativeQuery = true)
List<ContestantsDTO> getAllApprovedContestants(@Param("userId") Long userId);




//get contestants by ID
@Query(value = """
    SELECT 
        p.id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.photo_url AS seasonPhotoUrl,
        p.date_of_birth AS dateOfBirth,
        p.location AS location,
        p.description AS description,
        p.user_id AS userId,
        s.id AS seasonId,
        s.name AS seasonName,
        s.prize_money AS prizeMoney,
        s.registration_start_date AS registrationStartDate,
        s.registration_end_date AS registrationEndDate,
        s.voting_start_date AS votingStartDate,
        s.voting_end_date AS votingEndDate,
        COUNT(v.id) AS voteCount,
        EXISTS (
            SELECT 1 
            FROM votes v2 
            WHERE v2.contestant_id = p.id 
              AND v2.voter_id = :userId
        ) AS hasVoted
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    LEFT JOIN votes v ON v.contestant_id = p.id
    WHERE p.status = 'APPROVED'
      AND p.id = :id
    GROUP BY 
        p.id, p.name, p.photo_url, p.date_of_birth, 
        p.location, p.description, p.user_id,
        s.id, s.name, s.prize_money, s.photo_url,
        s.registration_start_date,
        s.registration_end_date,
        s.voting_start_date,
        s.voting_end_date
""", nativeQuery = true)
Optional<ContestantsDTO> getApprovedContestantById(
        @Param("id") Long id,
        @Param("userId") Long userId
);




// pending contestants order by date of birth ascending
@Query(value = """
    SELECT 
        p.id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.photo_url AS seasonPhotoUrl,
        p.date_of_birth AS dateOfBirth,
        p.location AS location,
        p.description AS description,
        p.user_id AS userId,
        s.id AS seasonId,
        s.name AS seasonName,
        s.prize_money AS prizeMoney,
        s.registration_start_date AS registrationStartDate,
        s.registration_end_date AS registrationEndDate,
        s.voting_start_date AS votingStartDate,
        s.voting_end_date AS votingEndDate
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    WHERE p.status = 'PENDING'
    ORDER BY p.date_of_birth ASC
    """, nativeQuery = true)
List<ContestantsStatusDTO> getAllPendingContestants();




// rejected contestants order by date of birth ascending
@Query(value = """
    SELECT 
        p.id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.photo_url AS seasonPhotoUrl,
        p.date_of_birth AS dateOfBirth,
        p.location AS location,
        p.description AS description,
        p.user_id AS userId,
        s.id AS seasonId,
        s.name AS seasonName,
        s.prize_money AS prizeMoney,
        s.registration_start_date AS registrationStartDate,
        s.registration_end_date AS registrationEndDate,
        s.voting_start_date AS votingStartDate,
        s.voting_end_date AS votingEndDate
    FROM participations p
    JOIN seasons s ON p.season_id = s.id
    WHERE p.status = 'REJECTED'
    ORDER BY p.date_of_birth ASC
    """, nativeQuery = true)
List<ContestantsStatusDTO> getAllRejectedContestants();




// ✅ Get contestants of a season with vote info
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

        COUNT(v.id) AS totalVotes,

        CASE 
            WHEN EXISTS (
                SELECT 1
                FROM votes v2
                WHERE v2.contestant_id = p.id
                AND v2.voter_id = :userId
            )
            THEN TRUE
            ELSE FALSE
        END AS hasVoted

    FROM participations p

    LEFT JOIN votes v 
        ON v.contestant_id = p.id

    WHERE p.season_id = :seasonId
    AND p.status = 'APPROVED'

    GROUP BY 
        p.id,
        p.user_id,
        p.season_id,
        p.name,
        p.description,
        p.date_of_birth,
        p.location,
        p.photo_url
    """, nativeQuery = true)
List<SeasonContestants> findSeasonContestants(
        @Param("seasonId") Long seasonId,
        @Param("userId") Long userId
);






//search by name 
@Query(value = """
    SELECT 
        p.id AS id,
        p.name AS name,
        p.photo_url AS photoUrl
    FROM participations p
    WHERE p.status = 'APPROVED'
      AND p.name LIKE CONCAT('%', :name, '%')
    ORDER BY p.name ASC
    LIMIT 10
""", nativeQuery = true)
List<ContestantByName> findByNameContaining(
        @Param("name") String name
);




//delete participation by id
void deleteById(Long id);

}