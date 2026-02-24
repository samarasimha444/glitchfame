package com.example.glitchfame.Repository.UserRepository;

import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.dto.UserDTO.SeasonDashboardProjection;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DashboardSeasonRepository extends JpaRepository<Seasons, Long> {

    




    @Query(value = """
        SELECT 
            s.id AS id,
            s.name AS name,
            s.prize_money AS prizeMoney,
            s.registration_start_date AS registrationStartDate,
            s.registration_end_date AS registrationEndDate,
            s.voting_start_date AS votingStartDate,
            s.voting_end_date AS votingEndDate,
            p.status AS status
        FROM seasons s
        LEFT JOIN (
            SELECT p1.season_id,
                   p1.status
            FROM participations p1
            INNER JOIN (
                SELECT season_id, MAX(id) AS max_id
                FROM participations
                WHERE user_id = :userId
                  AND deleted = 0
                GROUP BY season_id
            ) latest
            ON p1.id = latest.max_id
        ) p
        ON s.id = p.season_id
        WHERE s.deleted = 0
        ORDER BY s.registration_start_date DESC
        """, nativeQuery = true)
    List<SeasonDashboardProjection> getDashboardSeasons(@Param("userId") Long userId);
}