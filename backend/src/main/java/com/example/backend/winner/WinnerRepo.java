package com.example.backend.winner;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WinnerRepo extends JpaRepository<Winner, UUID> {
      Optional<Winner> findBySeasonName(String seasonName);

}