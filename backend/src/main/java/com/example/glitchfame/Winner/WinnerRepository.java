package com.example.glitchfame.Winner;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface WinnerRepository extends JpaRepository<SeasonWinner, Long> {

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
        JOIN participation p ON p.season_id = s.id
        LEFT JOIN votes v ON v.contestant_id = p.id

        WHERE s.id = :seasonId

        GROUP BY p.id
    """, nativeQuery = true)
    void insertSeasonWinners(Long seasonId);
}