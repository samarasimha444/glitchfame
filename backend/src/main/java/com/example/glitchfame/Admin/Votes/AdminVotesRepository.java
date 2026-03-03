package com.example.glitchfame.Admin.Votes;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminVotesRepository extends JpaRepository<AdminVotes, Long> {

    Optional<AdminVotes> findByParticipationId(Long participationId);

    boolean existsByParticipationId(Long participationId);

    void deleteByParticipationId(Long participationId);
}