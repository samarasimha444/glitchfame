package com.example.glitchfame.Repository.UserRepository;

import com.example.glitchfame.Entity.Participation;
import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    boolean existsByUserAndSeason(User user, Seasons season);

}