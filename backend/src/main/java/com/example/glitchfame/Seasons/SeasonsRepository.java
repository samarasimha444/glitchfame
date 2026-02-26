package com.example.glitchfame.Seasons;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.glitchfame.Seasons.DTO.SeasonsDTO;
import org.springframework.data.repository.query.Param;



public interface SeasonsRepository extends JpaRepository<Seasons, Long> {

    //upcoming seasons order by registration start date ascending
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
        CASE 
            WHEN p.id IS NULL THEN 'NOT_PARTICIPATED'
            ELSE p.status
        END AS participationStatus
    FROM seasons s
    LEFT JOIN participations p
        ON p.season_id = s.id
        AND p.user_id = :userId
    WHERE NOW() < s.registration_start_date
    ORDER BY s.registration_start_date ASC
    """, nativeQuery = true)
List<SeasonsDTO> getUpcomingSeasons(@Param("userId") Long userId);





    //live seasons order by registration end date ascending
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
        CASE 
            WHEN p.id IS NULL THEN 'NOT_PARTICIPATED'
            ELSE p.status
        END AS participationStatus
    FROM seasons s
    LEFT JOIN participations p
        ON p.season_id = s.id
        AND p.user_id = :userId
    WHERE NOW() BETWEEN s.registration_start_date AND s.registration_end_date
    ORDER BY s.registration_end_date ASC
    """, nativeQuery = true)
List<SeasonsDTO> getLiveSeasons(@Param("userId") Long userId);







   //past seasons order by voting end date descending
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
        CASE 
            WHEN p.id IS NULL THEN 'NOT_PARTICIPATED'
            ELSE p.status
        END AS participationStatus
    FROM seasons s
    LEFT JOIN participations p
        ON p.season_id = s.id
        AND p.user_id = :userId
    WHERE NOW() > s.voting_end_date
    ORDER BY s.voting_end_date DESC
    """, nativeQuery = true)
List<SeasonsDTO> getPastSeasons(@Param("userId") Long userId);


//delete season
void deleteById(Long id);
}
