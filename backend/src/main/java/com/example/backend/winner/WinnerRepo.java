package com.example.backend.winner;
import com.example.backend.winner.dto.WinnerDTO;
import com.example.backend.participation.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface WinnerRepo extends JpaRepository<Participation, UUID> {

    @Query("""
        SELECT new com.example.backend.winner.dto.WinnerDTO(
            s.seasonId,
            s.name,
            p.participationId,
            p.name,
            p.photoUrl,
            p.score,
            p.rank
        )
        FROM Season s
        JOIN Participation p ON s.seasonId = p.seasonId
        WHERE s.votingEndDate < CURRENT_TIMESTAMP
          AND p.status = 'APPROVED'
          AND p.rank = 1
        ORDER BY s.votingEndDate DESC
    """)
    List<WinnerDTO> getPastSeasonWinners();
}