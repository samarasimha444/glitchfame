package com.example.glitchfame.Contestants;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import java.util.List;
import com.example.glitchfame.Contestants.DTO.ContestantsStatusDTO;

@Repository
public interface ContestantRepository extends JpaRepository<Participation, Long> {



    // Custom query to fetch all approved contestants with their season details and vote count
    @Query(value = """
        SELECT 
            p.id AS participationId,
            p.name AS participantName,
            p.photo_url AS photoUrl,
            p.date_of_birth AS dateOfBirth,
            p.location AS location,
            p.description AS description,
            p.user_id AS userId,
            s.id AS seasonId,
            s.name AS seasonName,
            s.prize_money AS prizeMoney,
            COUNT(v.id) AS voteCount
        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        LEFT JOIN votes v ON v.contestant_id = p.id
        WHERE p.status = 'APPROVED'
        GROUP BY 
            p.id, p.name, p.photo_url, p.date_of_birth, 
            p.location, p.description, p.user_id,
            s.id, s.name, s.prize_money
        ORDER BY voteCount DESC
        """, nativeQuery = true)
    List<ContestantsDTO> getAllApprovedContestants();






    //get pending contestants for admin to review
    @Query(value = """
        SELECT 
            p.id AS participationId,
            p.name AS participantName,
            p.photo_url AS photoUrl,
            p.date_of_birth AS dateOfBirth,
            p.location AS location,
            p.description AS description,
            p.user_id AS userId,
            s.id AS seasonId,
            s.name AS seasonName,
            s.prize_money AS prizeMoney
        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        WHERE p.status = 'PENDING'
        ORDER BY p.date_of_birth ASC
        """, nativeQuery = true)
    List<ContestantsStatusDTO> getAllPendingContestants();





//get rejected contestants for admin to review
    @Query(value = """
        SELECT 
            p.id AS participationId,
            p.name AS participantName,
            p.photo_url AS photoUrl,
            p.date_of_birth AS dateOfBirth,
            p.location AS location,
            p.description AS description,
            p.user_id AS userId,
            s.id AS seasonId,
            s.name AS seasonName,
            s.prize_money AS prizeMoney
        FROM participations p
        JOIN seasons s ON p.season_id = s.id
        WHERE p.status = 'REJECTED'
        ORDER BY p.date_of_birth ASC
        """, nativeQuery = true)
    List<ContestantsStatusDTO> getAllRejectedContestants();




}