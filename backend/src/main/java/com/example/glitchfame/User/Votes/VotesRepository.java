package com.example.glitchfame.User.Votes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

@Repository
public interface VotesRepository extends JpaRepository<Vote, Long> {
   
   // Check if a vote exists for a given contestant and voter
   boolean existsByContestant_IdAndVoter_Id(Long contestantId, Long voterId);

   // Delete a vote by contestant and voter
    void deleteByContestant_IdAndVoter_Id(Long contestantId, Long voterId);



    // Count the number of votes for a given contestant
    long countByContestant_Id(Long contestantId);

   //count the votes in a season
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



}