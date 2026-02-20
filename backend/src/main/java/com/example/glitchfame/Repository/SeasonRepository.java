package com.example.glitchfame.Repository;

import com.example.glitchfame.Entity.Seasons;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface SeasonRepository extends JpaRepository<Seasons, Long> {

    boolean existsByNameAndDeletedFalse(String name);
    List<Seasons> findByDeletedFalse();

}