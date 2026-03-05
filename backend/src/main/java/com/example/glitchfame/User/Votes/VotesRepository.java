package com.example.glitchfame.User.Votes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

@Repository
public interface VotesRepository extends JpaRepository<Vote, Long> {

    // Check if vote exists
    boolean existsByContestant_IdAndVoter_Id(Long contestantId, Long voterId);

    // Delete vote
    void deleteByContestant_IdAndVoter_Id(Long contestantId, Long voterId);

    // Count only USER votes
    long countByContestant_Id(Long contestantId);

    // Count user votes inside season
    @Query(value = """
        SELECT COUNT(*)
        FROM votes v
        JOIN participations p ON p.id = v.contestant_id
        WHERE v.voter_id = :userId
        AND p.season_id = :seasonId
    """, nativeQuery = true)
    long countVotesByUserInSeason(
            @Param("userId") Long userId,
            @Param("seasonId") Long seasonId
    );


    
    // TOTAL votes (user + admin)
    @Query(value = """
        SELECT 
            COALESCE(COUNT(v.id),0) + COALESCE(av.admin_vote_count,0)
        FROM participations p
        LEFT JOIN votes v ON v.contestant_id = p.id
        LEFT JOIN admin_votes av ON av.participation_id = p.id
        WHERE p.id = :participationId
        GROUP BY p.id, av.admin_vote_count
    """, nativeQuery = true)
    Long getTotalVotes(@Param("participationId") Long participationId);

}