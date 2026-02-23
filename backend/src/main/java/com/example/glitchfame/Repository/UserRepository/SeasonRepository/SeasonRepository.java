package com.example.glitchfame.Repository.UserRepository.SeasonRepository;
import com.example.glitchfame.Entity.Seasons;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



public interface SeasonRepository extends JpaRepository<Seasons, Long> {

    // Fetch all seasons where deleted = false
    List<Seasons> findByDeletedFalseOrderByRegistrationStartDateDesc();

}

