package com.example.backend.participation.admin;
import com.example.backend.participation.Participation;
import com.example.backend.participation.admin.dto.ParticipantsByStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;



public interface ParticipationAdminRepo extends JpaRepository<Participation, UUID> {


//PENDING / REJECTED → DESC
@Query(value = """
    SELECT
        p.participation_id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.name AS seasonName,
        p.season_id AS seasonId,
        p.status AS status
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = :status
    AND s.registration_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    ORDER BY p.modified_at DESC
    """,
    countQuery = """
    SELECT COUNT(*)
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = :status
    AND s.registration_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    """,
    nativeQuery = true)
Page<ParticipantsByStatus> findLiveByStatusOrderByModifiedDesc(
        @Param("status") String status,
        Pageable pageable
);

//pending / rejected → ASC
@Query(value = """
    SELECT
        p.participation_id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.name AS seasonName,
        p.season_id AS seasonId,
        p.status AS status
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = :status
    AND s.registration_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    ORDER BY p.modified_at ASC
    """,
    countQuery = """
    SELECT COUNT(*)
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = :status
    AND s.registration_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    """,
    nativeQuery = true)
Page<ParticipantsByStatus> findLiveByStatusOrderByModifiedAsc(
        @Param("status") String status,
        Pageable pageable
);


//livd and  approved
@Query(value = """
    SELECT
        p.participation_id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.name AS seasonName,
        p.season_id AS seasonId,
        p.status AS status
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.status = 'APPROVED'
    AND s.registration_start_date <= CURRENT_TIMESTAMP
    AND s.voting_end_date >= CURRENT_TIMESTAMP
    """,
    nativeQuery = true)
List<ParticipantsByStatus> findAllLiveApproved();


//fetch by ids
@Query(value = """
    SELECT
        p.participation_id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.name AS seasonName,
        p.season_id AS seasonId,
        p.status AS status
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.participation_id IN (:ids)
    """,
    nativeQuery = true)
List<ParticipantsByStatus> findByIds(@Param("ids") List<UUID> ids);



















 

//search by name filter by participant status(approved/rejected/pending)
@Query(value = """
    SELECT
        p.participation_id AS participationId,
        p.name AS participantName,
        p.photo_url AS participantPhotoUrl,
        s.name AS seasonName,
        p.season_id AS seasonId,
        p.status AS status

    FROM participation p
    JOIN season s ON s.season_id = p.season_id

    WHERE p.name ILIKE '%' || :name || '%'
    AND (:status IS NULL OR p.status = :status)

    ORDER BY p.participation_id DESC
    """,
    countQuery = """
    SELECT COUNT(*)
    FROM participation p
    JOIN season s ON s.season_id = p.season_id
    WHERE p.name ILIKE '%' || :name || '%'
    AND (:status IS NULL OR p.status = :status)
    """,
    nativeQuery = true)
Page<ParticipantsByStatus> searchParticipants(
        @Param("name") String name,
        @Param("status") String status,
        Pageable pageable
);




    // reset season participations (keeps season, deletes all participants)
    @Modifying
    @Transactional
    @Query("DELETE FROM Participation p WHERE p.seasonId = :seasonId")
    void deleteAllBySeasonId(@Param("seasonId") UUID seasonId);




    // to delete all the redis keys after deleting the season
    @Query("SELECT p.participationId FROM Participation p WHERE p.seasonId = :seasonId")
    List<UUID> findParticipationIdsBySeasonId(UUID seasonId);
}