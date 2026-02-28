package com.example.glitchfame.Leadboard;
import com.example.glitchfame.Leadboard.DTO.LeaderboardProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import  com.example.glitchfame.Contestants.Participation;


import java.util.List;

@Repository
public interface LeadboardRepository extends JpaRepository<Participation, Long> {

    // 🔥 Leaders of ALL Seasons
    @Query(value = """
            SELECT *,
                   RANK() OVER (
                       PARTITION BY season_id
                       ORDER BY vote_count DESC, created_at ASC
                   ) AS rank_position
            FROM (
                SELECT 
                    p.id AS participation_id,
                    p.user_id,
                    p.season_id,
                    p.name AS participant_name,
                    p.description,
                    p.status,
                    p.date_of_birth,
                    p.location,
                    p.photo_url,
                    p.created_at,

                    s.name AS season_name,
                    s.prize_money,
                    s.registration_start_date,
                    s.registration_end_date,
                    s.voting_start_date,
                    s.voting_end_date,
                    s.photo_url AS season_photo_url,

                    COUNT(v.id) AS vote_count,

                    MAX(CASE 
                            WHEN v.voter_id = :userId THEN 1
                            ELSE 0
                        END) AS has_voted

                FROM participations p
                JOIN seasons s ON s.id = p.season_id
                LEFT JOIN votes v ON v.contestant_id = p.id
                WHERE p.status = 'APPROVED'
                GROUP BY p.id
            ) ranked
            ORDER BY season_id, rank_position
            """, nativeQuery = true)
    List<LeaderboardProjection> findLeadersOfAllSeasons(
            @Param("userId") Long userId
    );




    // 🔥 Leaders of ONE Season
    @Query(value = """
        SELECT 
            participation_id,
            user_id,
            season_id,
            participant_name,
            description,
            status,
            date_of_birth,
            location,
            photo_url,
            created_at,
            season_name,
            prize_money,
            registration_start_date,
            registration_end_date,
            voting_start_date,
            voting_end_date,
            season_photo_url,
            vote_count,
            has_voted,
            ROW_NUMBER() OVER (
                ORDER BY vote_count DESC, created_at ASC
            ) AS rank_position
        FROM (
            SELECT
                p.id AS participation_id,
                p.user_id,
                p.season_id,
                p.name AS participant_name,
                p.description,
                p.status,
                p.date_of_birth,
                p.location,
                p.photo_url,
                p.created_at,

                s.name AS season_name,
                s.prize_money,
                s.registration_start_date,
                s.registration_end_date,
                s.voting_start_date,
                s.voting_end_date,
                s.photo_url AS season_photo_url,

                COUNT(v.id) AS vote_count,

                MAX(CASE
                        WHEN v.voter_id = :userId THEN 1
                        ELSE 0
                    END) AS has_voted

            FROM participations p
            JOIN seasons s ON s.id = p.season_id
            LEFT JOIN votes v ON v.contestant_id = p.id
            WHERE p.season_id = :seasonId
              AND p.status = 'APPROVED'
            GROUP BY p.id
        ) ranked
        ORDER BY rank_position
        """, nativeQuery = true)
List<LeaderboardProjection> findLeadersBySeason(
        @Param("seasonId") Long seasonId,
        @Param("userId") Long userId
);
}