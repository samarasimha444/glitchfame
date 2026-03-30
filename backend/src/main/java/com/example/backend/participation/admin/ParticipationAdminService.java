package com.example.backend.participation.admin;

import com.example.backend.participation.Participation;
import com.example.backend.participation.admin.dto.ParticipantsByStatus;
import com.example.backend.participation.admin.dto.ParticipantsByStatusImpl;
import com.example.backend.votes.query.VoteQueryService;
import com.example.backend.votes.query.dto.VoteQuery;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;


import java.util.*;

@Service
@RequiredArgsConstructor
public class ParticipationAdminService {

    private final ParticipationAdminRepo participationAdminRepo;
    private final VoteQueryService voteQueryService;
    private final StringRedisTemplate redis; // 🔥 needed for rank

    // ================= LIVE PARTICIPANTS =================

    public Page<ParticipantsByStatus> getLiveParticipantsByStatus(
            String status,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

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

            // 🔥 rank calculation
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

    // ================= SEARCH =================

    public Page<ParticipantsByStatus> searchLiveApprovedParticipants(
            String name,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<ParticipantsByStatus> result =
                participationAdminRepo.searchLiveApprovedParticipants(name, pageable);

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
                    meta.getScore(),
                    rank,
                    meta.isHasVoted(),
                    meta.isHasKilled()
            );
        });
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