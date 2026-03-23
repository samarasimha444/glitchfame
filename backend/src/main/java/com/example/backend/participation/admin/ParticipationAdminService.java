package com.example.backend.participation.admin;

import com.example.backend.participation.Participation;
import com.example.backend.participation.admin.dto.ParticipantsByStatus;
import com.example.backend.participation.admin.dto.ParticipantsByStatusImpl;
import com.example.backend.votes.VoteQueryService;
import com.example.backend.votes.dto.VoteMeta;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ParticipationAdminService {

    private final ParticipationAdminRepo participationAdminRepo;
    private final VoteQueryService voteQueryService;

    // get participants from LIVE seasons filtered by status
    public Page<ParticipantsByStatus> getLiveParticipantsByStatus(
            String status,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<ParticipantsByStatus> result =
                participationAdminRepo.findLiveParticipantsByStatus(status, pageable);

        if (result.isEmpty()) return result;

        // extract ids
        List<UUID> ids = result.stream()
                .map(ParticipantsByStatus::getParticipationId)
                .toList();

        // ⚠️ assuming same season per page (acceptable if your query guarantees it)
        UUID seasonId = result.getContent().get(0).getSeasonId();

        Map<UUID, VoteMeta> voteMap =
                voteQueryService.getVoteMetaBatch(ids, seasonId, null);

        return result.map(p -> {

            VoteMeta meta = voteMap.getOrDefault(
                    p.getParticipationId(),
                    new VoteMeta(0L, false)
            );

            long votes = "APPROVED".equals(p.getStatus())
                    ? meta.getVotes()
                    : 0L;

            return new ParticipantsByStatusImpl(
                    p.getParticipationId(),
                    p.getParticipantName(),
                    p.getParticipantPhotoUrl(),
                    p.getSeasonName(),
                    p.getSeasonId(),     
                    p.getStatus(),       
                    votes                
            );
        });
    }


    // admin updates participant status
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


    // search LIVE approved participants by name
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

        Map<UUID, VoteMeta> voteMap =
                voteQueryService.getVoteMetaBatch(ids, seasonId, null);

        return result.map(p -> {

            VoteMeta meta = voteMap.getOrDefault(
                    p.getParticipationId(),
                    new VoteMeta(0L, false)
            );

            return new ParticipantsByStatusImpl(
                    p.getParticipationId(),
                    p.getParticipantName(),
                    p.getParticipantPhotoUrl(),
                    p.getSeasonName(),
                    p.getSeasonId(),     // ✅ FIXED
                    p.getStatus(),       // ✅ FIXED
                    meta.getVotes()
            );
        });
    }



// delete participant by id
public String deleteParticipation(UUID participationId) {

    if (!participationAdminRepo.existsById(participationId)) {
        throw new IllegalStateException("Participation not found");
    }

    participationAdminRepo.deleteById(participationId);

    return "Participant deleted successfully";
}
}
