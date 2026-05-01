package com.example.backend.participation.admin;

import com.example.backend.participation.Participation;
import com.example.backend.participation.admin.dto.ParticipantsByStatus;
import com.example.backend.participation.admin.dto.ParticipantsByStatusImpl;
import com.example.backend.votes.query.VoteQueryService;
import com.example.backend.votes.query.dto.VoteQuery;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;



import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipationAdminService {

    private final ParticipationAdminRepo participationAdminRepo;
    private final VoteQueryService voteQueryService;
    private final StringRedisTemplate redis; // 🔥 needed for rank



    // ================= LIVE PARTICIPANTS =================
 public Page<ParticipantsByStatus> getLiveParticipantsByStatus(
        String status,
        String sortDir,
        int page,
        int size
) {

    Sort sort = Sort.by("modifiedAt");

    // 🔥 apply direction
    sort = "asc".equalsIgnoreCase(sortDir)
            ? sort.ascending()
            : sort.descending(); // default desc

    Pageable pageable = PageRequest.of(page, size, sort);

    Page<ParticipantsByStatus> result =
            participationAdminRepo.findLiveParticipantsByStatus(status, pageable);

    if (result.isEmpty()) return result;

    List<UUID> ids = result.stream()
            .map(ParticipantsByStatus::getParticipationId)
            .toList();

    UUID seasonId = result.getContent().get(0).getSeasonId();

    String leaderboardKey = "leaderboard:season:" + seasonId;

    Map<UUID, VoteQuery> metaMap =
            voteQueryService.getMetaBatch(ids, seasonId, null);

    return result.map(p -> {

        VoteQuery meta = metaMap.getOrDefault(
                p.getParticipationId(),
                new VoteQuery(0L, 0L, 0, 0, false, false)
        );

        long score = "APPROVED".equals(p.getStatus())
                ? meta.getScore()
                : 0L;

        Long rankObj = redis.opsForZSet()
                .reverseRank(leaderboardKey, p.getParticipationId().toString());

        long rank = (rankObj == null) ? 0 : rankObj + 1;

        return new ParticipantsByStatusImpl(
                p.getParticipationId(),
                p.getParticipantName(),
                p.getParticipantPhotoUrl(),
                p.getSeasonName(),
                p.getSeasonId(),
                p.getStatus(),
                score,
                rank,
                meta.isHasVoted(),
                meta.isHasKilled()
        );
    });
}







    // ================= UPDATE STATUS =================
public void updateParticipationStatus(UUID participationId, String status) {
        Participation participation = participationAdminRepo.findById(participationId)
                .orElseThrow(() -> new IllegalStateException("Participation not found"));
        if (!status.equals("APPROVED") &&
            !status.equals("REJECTED") &&
            !status.equals("PENDING")) {
            throw new IllegalArgumentException("Invalid status");
        }
        participation.setStatus(status);
        participationAdminRepo.save(participation);
    }


    










    //search by name filter  by status in live season
  public Page<ParticipantsByStatus> searchParticipants(
        String name,
        String status,
        String sortDir,
        int page,
        int size
) {

    Pageable pageable = PageRequest.of(page, size);

    Page<ParticipantsByStatus> result =
            participationAdminRepo.searchParticipants(name, status, pageable);

    if (result.isEmpty()) return result;

    List<ParticipantsByStatus> content = result.getContent();

    // ✅ Group ONLY approved by season
    Map<UUID, List<ParticipantsByStatus>> approvedBySeason =
            content.stream()
                    .filter(p -> "APPROVED".equals(p.getStatus()))
                    .collect(Collectors.groupingBy(ParticipantsByStatus::getSeasonId));

    Map<UUID, VoteQuery> metaMap = new HashMap<>();
    Map<UUID, Long> rankMap = new HashMap<>();

    // ✅ Process each season separately
    for (var entry : approvedBySeason.entrySet()) {

        UUID seasonId = entry.getKey();

        List<UUID> ids = entry.getValue().stream()
                .map(ParticipantsByStatus::getParticipationId)
                .toList();

        String leaderboardKey = "l:" + seasonId;

        // 🔹 batch meta
        Map<UUID, VoteQuery> batchMeta =
                voteQueryService.getMetaBatch(ids, seasonId, null);

        metaMap.putAll(batchMeta);

        // 🔹 rank lookup
        for (UUID id : ids) {
            Long r = redis.opsForZSet()
                    .reverseRank(leaderboardKey, id.toString());

            if (r != null) {
                rankMap.put(id, r + 1);
            }
        }
    }

    // ✅ Build enriched list (IMPORTANT: enforce interface type)
    List<ParticipantsByStatus> enriched = content.stream()
            .<ParticipantsByStatus>map(p -> {

                if (!"APPROVED".equals(p.getStatus())) {
                    return new ParticipantsByStatusImpl(
                            p.getParticipationId(),
                            p.getParticipantName(),
                            p.getParticipantPhotoUrl(),
                            p.getSeasonName(),
                            p.getSeasonId(),
                            p.getStatus(),
                            0L,
                            0L,
                            false,
                            false
                    );
                }

                VoteQuery meta = metaMap.getOrDefault(
                        p.getParticipationId(),
                        new VoteQuery(0L, 0L, 0, 0, false, false)
                );

                long rank = rankMap.getOrDefault(
                        p.getParticipationId(),
                        0L
                );

                return new ParticipantsByStatusImpl(
                        p.getParticipationId(),
                        p.getParticipantName(),
                        p.getParticipantPhotoUrl(),
                        p.getSeasonName(),
                        p.getSeasonId(),
                        p.getStatus(),
                        meta.getScore(),
                        rank,
                        meta.isHasVoted(),
                        meta.isHasKilled() // keep as-is if method name not changed
                );
            })
            .toList();

    // 🔥 Sort by score
    Comparator<ParticipantsByStatus> comparator =
            Comparator.comparingLong(ParticipantsByStatus::getScore);

    if ("desc".equalsIgnoreCase(sortDir)) {
        comparator = comparator.reversed();
    }

    List<ParticipantsByStatus> sorted = enriched.stream()
            .sorted(comparator)
            .toList();

    // ⚠️ Manual pagination AFTER sorting
    int start = Math.min(page * size, sorted.size());
    int end = Math.min(start + size, sorted.size());

    List<ParticipantsByStatus> paged = sorted.subList(start, end);
        return new PageImpl<>(paged, pageable, sorted.size());
}







    // ================= DELETE =================

    public String deleteParticipation(UUID participationId) {
if (!participationAdminRepo.existsById(participationId)) {
            throw new IllegalStateException("Participation not found");
        }

        participationAdminRepo.deleteById(participationId);

        return "Participant deleted successfully";
    }
}