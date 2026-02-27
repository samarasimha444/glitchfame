package com.example.glitchfame.Votes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotesRepository extends JpaRepository<Vote, Long> {
   
   // Check if a vote exists for a given contestant and voter
   boolean existsByContestant_IdAndVoter_Id(Long contestantId, Long voterId);

   // Delete a vote by contestant and voter
    void deleteByContestant_IdAndVoter_Id(Long contestantId, Long voterId);



    // Count the number of votes for a given contestant
    long countByContestant_Id(Long contestantId);

}