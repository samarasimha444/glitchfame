package com.example.glitchfame.Winner;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface WinnerRepository extends JpaRepository<SeasonWinner, Long> {


/* =========================================================
INSERT SEASON WINNER
========================================================= */

@Modifying
@Transactional
@Query(value = """
INSERT INTO season_winners
(season_id, season_name, contestant_id, contestant_name, photo_url, prize_money, total_votes)

SELECT
    s.id,
    s.name,
    p.id,
    p.name,
    p.photo_url,
    s.prize_money,

    GREATEST(
        COUNT(v.id) + COALESCE(av.admin_vote_count, 0),
        0
    ) AS total_votes

FROM seasons s
JOIN participations p 
    ON p.season_id = s.id

LEFT JOIN votes v 
    ON v.contestant_id = p.id

LEFT JOIN admin_votes av 
    ON av.participation_id = p.id

WHERE s.id = :seasonId
AND p.status = 'APPROVED'

GROUP BY
    s.id,
    s.name,
    s.prize_money,
    p.id,
    p.name,
    p.photo_url,
    av.admin_vote_count

ORDER BY total_votes DESC
LIMIT 6
""", nativeQuery = true)
void insertSeasonWinner(@Param("seasonId") Long seasonId);



/* =========================================================
CHECK IF WINNER ALREADY EXISTS
========================================================= */

boolean existsBySeasonId(Long seasonId);



/* =========================================================
GET WINNERS OF ALL SEASONS
========================================================= */

@Query(value = """
SELECT *
FROM season_winners
ORDER BY season_id DESC
""", nativeQuery = true)
List<SeasonWinner> findAllSeasonWinners();



/* =========================================================
GET WINNER OF A SPECIFIC SEASON
========================================================= */

@Query(value = """
SELECT *
FROM season_winners
WHERE season_id = :seasonId
""", nativeQuery = true)
List<SeasonWinner> findWinnersBySeason(@Param("seasonId") Long seasonId);

}