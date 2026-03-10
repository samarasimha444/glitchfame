package com.example.glitchfame.User.Leadboard;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.glitchfame.User.Contestants.Participation;
import com.example.glitchfame.User.Leadboard.DTO.LeaderboardProjection;

import java.util.List;

@Repository
public interface LeadboardRepository extends JpaRepository<Participation, Long> {

    // ============================================================
    // 🔥 TOP 3 OF ALL SEASONS (Per Season)
    // ============================================================

    @Query(value = """
        SELECT * FROM (
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

                    COALESCE(COUNT(v.id),0) + COALESCE(a.admin_vote_count,0) AS vote_count,

                    MAX(CASE 
                        WHEN v.voter_id = :userId THEN 1
                        ELSE 0
                    END) AS has_voted

                FROM participations p
                JOIN seasons s ON s.id = p.season_id
                LEFT JOIN votes v ON v.contestant_id = p.id
                LEFT JOIN admin_votes a ON a.participation_id = p.id
                WHERE p.status = 'APPROVED'
                AND s.voting_start_date <= NOW()
                GROUP BY p.id, a.admin_vote_count
            ) ranked_inner
        ) ranked_outer
        WHERE rank_position <= 3
        ORDER BY season_id, rank_position
        """, nativeQuery = true)
List<LeaderboardProjection> findTop3OfAllSeasons(
        @Param("userId") Long userId
);

    // ============================================================
    // 🔥 TOP 3 OF ONE SEASON
    // ============================================================

    @Query(value = """
        SELECT * FROM (
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

                    COALESCE(COUNT(v.id),0) + COALESCE(a.admin_vote_count,0) AS vote_count,

                    MAX(CASE
                        WHEN v.voter_id = :userId THEN 1
                        ELSE 0
                    END) AS has_voted

                FROM participations p
                JOIN seasons s ON s.id = p.season_id
                LEFT JOIN votes v ON v.contestant_id = p.id
                LEFT JOIN admin_votes a ON a.participation_id = p.id
                WHERE p.season_id = :seasonId
                  AND p.status = 'APPROVED'
                GROUP BY p.id, a.admin_vote_count
            ) ranked_inner
        ) ranked_outer
        WHERE rank_position <= 3
        ORDER BY rank_position
        """, nativeQuery = true)
    List<LeaderboardProjection> findTop3BySeason(
            @Param("seasonId") Long seasonId,
            @Param("userId") Long userId
    );


    // ============================================================
    // 🔥 TOP 3 FOR WEBSOCKET (NO USER CONTEXT)
    // ============================================================

    @Query(value = """
        SELECT * FROM (
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
                0 AS has_voted,
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

                    COALESCE(COUNT(v.id),0) + COALESCE(a.admin_vote_count,0) AS vote_count

                FROM participations p
                JOIN seasons s ON s.id = p.season_id
                LEFT JOIN votes v ON v.contestant_id = p.id
                LEFT JOIN admin_votes a ON a.participation_id = p.id
                WHERE p.season_id = :seasonId
                  AND p.status = 'APPROVED'
                GROUP BY p.id, a.admin_vote_count
            ) ranked_inner
        ) ranked_outer
        WHERE rank_position <= 3
        ORDER BY rank_position
        """, nativeQuery = true)
    List<LeaderboardProjection> findTop3BySeasonForBroadcast(
            @Param("seasonId") Long seasonId
    );

}