package com.example.backend.participation;

import com.example.backend.auth.*;
import com.example.backend.participation.dto.*;
import com.example.backend.seasons.*;
import com.example.backend.seasons.dto.SeasonDetails;
import com.example.backend.seasons.dto.SeasonFullResponse;
import com.example.backend.votes.dto.*;
import com.example.backend.votes.VoteQueryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParticipationService {

    private final ParticipationRepo participationRepository;
    private final SeasonRepo seasonRepository;
    private final AuthRepo authRepository;
    private final VoteQueryService voteQueryService;


    // ✅ map participants with Redis vote data
    private Page<Participants> mapParticipants(Page<Participants> result, UUID authId) {

        List<UUID> ids = result.stream()
                .map(Participants::getParticipationId)
                .toList();

        UUID seasonId = result.getContent().isEmpty()
                ? null
                : result.getContent().get(0).getSeasonId();

        Map<UUID, VoteMeta> voteMetaMap =
                (seasonId != null && !ids.isEmpty())
                        ? voteQueryService.getVoteMetaBatch(ids, seasonId, authId)
                        : Collections.emptyMap();

        return result.map(p -> {

            VoteMeta meta = voteMetaMap.get(p.getParticipationId());

            if (meta == null) {
                log.warn("Missing Redis vote data for participationId={}", p.getParticipationId());
                meta = new VoteMeta(0L, false); // fallback
            }

            return new ParticipantsImpl(
                    p.getParticipationId(),
                    p.getParticipantName(),
                    p.getParticipantPhotoUrl(),
                    p.getSeasonId(),
                    meta.getVotes(),       // ✅ ALWAYS Redis
                    meta.isHasVoted()      // ✅ depends on authId
            );
        });
    }


    // create or reapply participation
    public void createParticipation(UUID authId, ParticipationForm form) {

        Auth auth = authRepository.findById(authId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!Boolean.TRUE.equals(auth.getCanParticipate())) {
            throw new IllegalStateException("Participation not allowed");
        }

        Season season = seasonRepository.findById(form.getSeasonId())
                .orElseThrow(() -> new IllegalStateException("Season not found"));

        if (season.isLocked()) {
            throw new IllegalStateException("Season is locked");
        }

        Instant now = Instant.now();

        if (now.isBefore(season.getRegistrationStartDate())) {
            throw new IllegalStateException("Registration not started");
        }

        if (now.isAfter(season.getRegistrationEndDate())) {
            throw new IllegalStateException("Registration ended");
        }

        Participation existing =
                participationRepository.findByAuthIdAndSeasonId(authId, form.getSeasonId())
                        .orElse(null);

        if (existing != null) {

            if (!"REJECTED".equals(existing.getStatus())) {
                throw new IllegalStateException("Already applied");
            }

            existing.setName(form.getName());
            existing.setDateOfBirth(form.getDateOfBirth());
            existing.setLocation(form.getLocation());
            existing.setDescription(form.getDescription());
            existing.setPhotoUrl(form.getPhotoUrl());
            existing.setStatus("PENDING");
            existing.setModifiedAt(now);

            participationRepository.save(existing);
            return;
        }

        Participation participation = Participation.builder()
                .authId(authId)
                .seasonId(form.getSeasonId())
                .name(form.getName())
                .dateOfBirth(form.getDateOfBirth())
                .location(form.getLocation())
                .description(form.getDescription())
                .photoUrl(form.getPhotoUrl())
                .status("PENDING")
                .modifiedAt(now)
                .build();

        participationRepository.save(participation);
    }


    // ✅ LIVE contestants
    public Page<Participants> getLiveContestants(UUID authId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> result =
                participationRepository.findLiveContestants(pageable);

        return mapParticipants(result, authId);
    }


    // ✅ SEARCH live
    public Page<Participants> searchLiveContestants(
            String name,
            UUID authId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> result =
                participationRepository.searchLiveApproved(name, pageable);

        return mapParticipants(result, authId);
    }


    // ✅ SEARCH by season
    public Page<Participants> searchParticipantsBySeason(
            UUID seasonId,
            String name,
            UUID authId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> result =
                participationRepository.searchApprovedBySeason(seasonId, name, pageable);

        return mapParticipants(result, authId);
    }


    // ✅ random live season
    public SeasonFullResponse getRandomLiveSeasonWithParticipants(
            UUID authId,
            int page,
            int size
    ) {

        Instant now = Instant.now();

        SeasonDetails season =
                seasonRepository.findRandomLiveSeason(
                        authId,
                        now,
                        PageRequest.of(0, 1)
                )
                .getContent()
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No live season found"));

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> participants =
                participationRepository.findApprovedParticipants(
                        season.getSeasonId(),
                        pageable
                );

        Page<Participants> enriched =
                mapParticipants(participants, authId);

        SeasonFullResponse response = new SeasonFullResponse();
        response.setSeason(season);
        response.setParticipants(enriched);

        return response;
    }


    

    // ✅ GET by ID (Redis-only votes)
    public ParticipantById getParticipationById(UUID participationId, UUID authId) {

        ParticipantById p =
                participationRepository.findParticipantById(participationId);

        if (p == null) return null;

        Map<UUID, VoteMeta> metaMap =
                voteQueryService.getVoteMetaBatch(
                        List.of(participationId),
                        p.getSeasonId(),
                        authId
                );

        VoteMeta meta = metaMap.get(participationId);

        if (meta == null) {
            log.warn("Missing Redis vote data for participationId={}", participationId);
            meta = new VoteMeta(0L, false); // fallback
        }

        return new ParticipantByIdImpl(
                p.getParticipationId(),
                p.getParticipantName(),
                p.getParticipantPhotoUrl(),
                p.getDateOfBirth(),
                p.getLocation(),
                p.getDescription(),
                p.getStatus(),
                p.getSeasonId(),
                p.getSeasonName(),
                p.getPrizeMoney(),
                meta.getVotes(),      // ✅ ALWAYS Redis
                meta.isHasVoted(),    // ✅ depends on authId
                p.getSeasonPhotoUrl(),
                p.getRegistrationStartDate(),
                p.getRegistrationEndDate(),
                p.getVotingStartDate(),
                p.getVotingEndDate()
        );
    }


//track my applications
public Page<TrackMyApplications> getMyApplications(UUID authId, int page, int size) {

    // pagination
    Pageable pageable = PageRequest.of(page, size);

    // direct repo call → no extra processing needed
    return participationRepository.findMyApplications(authId, pageable);
}


    // ✅ DELETE
    public void deleteParticipation(UUID participationId, UUID authId) {

        Participation participation =
                participationRepository.findById(participationId)
                        .orElseThrow(() -> new IllegalStateException("Participation not found"));

        if (!participation.getAuthId().equals(authId)) {
            throw new IllegalStateException("Unauthorized");
        }

        participationRepository.delete(participation);
    }
}