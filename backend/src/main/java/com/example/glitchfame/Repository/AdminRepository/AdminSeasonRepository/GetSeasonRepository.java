package com.example.glitchfame.Repository.AdminRepository.AdminSeasonRepository;
import com.example.glitchfame.Entity.Seasons;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface GetSeasonRepository extends JpaRepository<Seasons, Long> {

    // 🔥 Main paginated fetch (non-deleted only)
    Page<Seasons> findByDeletedFalse(Pageable pageable);
    Optional<Seasons> findByIdAndDeletedFalse(Long id);
}