package com.example.glitchfame.Winner;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface WinnerRepository extends JpaRepository<SeasonWinner, Long> {

    // insert winners for a season
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
    COUNT(v.id)

FROM seasons s
JOIN participations p ON p.season_id = s.id
LEFT JOIN votes v ON v.contestant_id = p.id

WHERE s.id = :seasonId

GROUP BY p.id
ORDER BY COUNT(v.id) DESC
LIMIT 1
""", nativeQuery = true)
void insertSeasonWinner(@Param("seasonId") Long seasonId);

   //cheeck winner is there or not
   boolean existsBySeasonId(Long seasonId);




    // get winners of ALL seasons
    @Query(value = """
        SELECT *
        FROM season_winners
        ORDER BY season_id DESC
    """, nativeQuery = true)
    List<SeasonWinner> findAllSeasonWinners();


    // get winners of a specific season
    @Query(value = """
        SELECT *
        FROM season_winners
        WHERE season_id = :seasonId
    """, nativeQuery = true)
    List<SeasonWinner> findWinnersBySeason(@Param("seasonId") Long seasonId);

}