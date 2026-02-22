package com.example.glitchfame.Repository.AdminRepository.AdminSeasonRepository;
import com.example.glitchfame.Entity.Seasons;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UpdateSeasonRepository extends JpaRepository<Seasons, Long> {

    Optional<Seasons> findByIdAndDeletedFalse(Long id);

    boolean existsByNameAndDeletedFalseAndIdNot(String name, Long id);
}