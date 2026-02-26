package com.example.glitchfame.Contestants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import java.util.List;
import com.example.glitchfame.Contestants.DTO.ContestantsStatusDTO;

@Repository
public interface ContestantRepository extends JpaRepository<Participation, Long> {

 //check whether a user has already applied for a season
boolean existsByUserIdAndSeasonId(Long userId, Long seasonId);



// approved contestants with vote count order by descending
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
        COUNT(v.id) AS voteCount
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
List<ContestantsDTO> getAllApprovedContestants();





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





//delete participation by id
void deleteById(Long id);

}