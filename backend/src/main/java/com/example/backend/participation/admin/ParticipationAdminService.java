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
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParticipationAdminService {

    private final ParticipationAdminRepo participationAdminRepo;
    private final VoteQueryService voteQueryService;
    private final StringRedisTemplate redis; // 🔥 needed for rank



public Page<ParticipantsByStatus> getLiveParticipantsByStatus(
        String status,
        String sortDir,
        int page,
        int size
) {

    boolean isApproved = "APPROVED".equalsIgnoreCase(status);

    // ================= PENDING / REJECTED =================
    if (!isApproved) {

        Pageable pageable = PageRequest.of(page, size);

        Page<ParticipantsByStatus> result =
                "asc".equalsIgnoreCase(sortDir)
                        ? participationAdminRepo.findLiveByStatusOrderByModifiedAsc(status, pageable)
                        : participationAdminRepo.findLiveByStatusOrderByModifiedDesc(status, pageable);

        if (result.isEmpty()) return result;

        Map<UUID, List<UUID>> seasonMap = result.stream()
                .collect(Collectors.groupingBy(
                        ParticipantsByStatus::getSeasonId,
                        Collectors.mapping(ParticipantsByStatus::getParticipationId, Collectors.toList())
                ));

        Map<UUID, VoteQuery> metaMap = new HashMap<>();

        for (Map.Entry<UUID, List<UUID>> entry : seasonMap.entrySet()) {
            metaMap.putAll(
                    voteQueryService.getMetaBatch(entry.getValue(), entry.getKey(), null)
            );
        }

        return result.map(p -> {

            VoteQuery meta = metaMap.getOrDefault(
                    p.getParticipationId(),
                    new VoteQuery(0L, 0L, 0, 0, false, false)
            );

            return new ParticipantsByStatusImpl(
                    p.getParticipationId(),
                    p.getParticipantName(),
                    p.getParticipantPhotoUrl(),
                    p.getSeasonName(),
                    p.getSeasonId(),
                    p.getStatus(),
                    0L,
                    0L,
                    meta.isHasVoted(),
                    meta.isHasKilled()
            );
        });
    }

    // ================= APPROVED =================

    List<ParticipantsByStatus> allApproved =
            participationAdminRepo.findAllLiveApproved();

    if (allApproved.isEmpty()) return Page.empty();

    Map<UUID, List<ParticipantsByStatus>> grouped =
            allApproved.stream()
                    .collect(Collectors.groupingBy(ParticipantsByStatus::getSeasonId));

    List<ParticipantsByStatus> finalList = new ArrayList<>();

    for (Map.Entry<UUID, List<ParticipantsByStatus>> entry : grouped.entrySet()) {

        UUID seasonId = entry.getKey();

        // 🔥 FIX: correct Redis key
        String key = "l:" + seasonId;

        int start = page * size;
        int end = start + size - 1;

        Set<String> idStrings = "asc".equalsIgnoreCase(sortDir)
                ? redis.opsForZSet().range(key, start, end)
                : redis.opsForZSet().reverseRange(key, start, end);

        List<ParticipantsByStatus> ordered;

        // ================= REDIS DATA EXISTS =================
        if (idStrings != null && !idStrings.isEmpty()) {

            List<UUID> ids = idStrings.stream()
                    .map(UUID::fromString)
                    .toList();

            List<ParticipantsByStatus> participants =
                    participationAdminRepo.findByIds(ids);

            Map<UUID, ParticipantsByStatus> map =
                    participants.stream().collect(Collectors.toMap(
                            ParticipantsByStatus::getParticipationId,
                            Function.identity()
                    ));

            ordered = ids.stream()
                    .map(map::get)
                    .filter(Objects::nonNull)
                    .toList();
        }

        // ================= FALLBACK (REDIS EMPTY) =================
        else {
            ordered = entry.getValue(); // fallback to DB list
        }

        // ================= BUILD RESPONSE =================

        for (int i = 0; i < ordered.size(); i++) {

            ParticipantsByStatus p = ordered.get(i);

            Double scoreObj = redis.opsForZSet()
                    .score(key, p.getParticipationId().toString());

            long score = scoreObj == null ? 0L : scoreObj.longValue();
            long rank = start + i + 1;

            finalList.add(new ParticipantsByStatusImpl(
                    p.getParticipationId(),
                    p.getParticipantName(),
                    p.getParticipantPhotoUrl(),
                    p.getSeasonName(),
                    p.getSeasonId(),
                    p.getStatus(),
                    score,
                    rank,
                    false,
                    false
            ));
        }
    }

    // ================= GLOBAL PAGINATION =================

    int start = page * size;

    if (start >= finalList.size()) {
        return Page.empty(PageRequest.of(page, size));
    }

    int end = Math.min(start + size, finalList.size());

    return new PageImpl<>(
            finalList.subList(start, end),
            PageRequest.of(page, size),
            finalList.size()
    );
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