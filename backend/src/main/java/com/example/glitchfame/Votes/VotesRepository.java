package com.example.glitchfame.Votes;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotesRepository extends JpaRepository<Vote, Long> {

   boolean existsByContestant_IdAndVoter_Id(Long contestantId, Long voterId);

    void deleteByContestant_IdAndVoter_Id(Long contestantId, Long voterId);

    long countByContestant_Id(Long contestantId);

}