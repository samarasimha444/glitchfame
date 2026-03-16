package com.example.backend.participation;

import com.example.backend.auth.*;
import com.example.backend.participation.dto.*;
import com.example.backend.seasons.*;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepo participationRepository;
    private final SeasonRepo seasonRepository;
    private final AuthRepo authRepository;
    private final StringRedisTemplate redis;


    /* ---------- FETCH VOTES FROM REDIS ---------- */

    private Map<UUID, Long> getVotesBatch(List<UUID> participationIds, UUID seasonId) {

        String leaderboardKey = "leaderboard:season:" + seasonId;

        Map<UUID, Long> votes = new HashMap<>();

        for (UUID id : participationIds) {

            Double score = redis.opsForZSet().score(
                    leaderboardKey,
                    id.toString()
            );

            votes.put(id, score == null ? 0L : score.longValue());
        }

        return votes;
    }


    /* ---------- MAP PARTICIPANTS + REDIS VOTES ---------- */

    private Page<Participants> mapParticipants(Page<Participants> result) {

        List<UUID> ids = result.stream()
                .map(Participants::getParticipationId)
                .toList();

        UUID seasonId = result.getContent().isEmpty()
                ? null
                : result.getContent().get(0).getSeasonId();

        Map<UUID, Long> voteMap =
                seasonId == null ? new HashMap<>() : getVotesBatch(ids, seasonId);

        return result.map(p -> new ParticipantsImpl(
                p.getParticipationId(),
                p.getParticipantName(),
                p.getParticipantPhotoUrl(),
                p.getSeasonId(),
                voteMap.getOrDefault(p.getParticipationId(), 0L),
                p.getHasVoted()
        ));
    }


    /* ---------- CREATE PARTICIPATION ---------- */

    public void createParticipation(UUID authId, ParticipationForm form) {

        Auth auth = authRepository.findById(authId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (!Boolean.TRUE.equals(auth.getCanParticipate())) {
            throw new IllegalStateException("Participation not allowed");
        }

        Season season = seasonRepository.findById(form.getSeasonId())
                .orElseThrow(() -> new IllegalStateException("Season not found"));

        if (season.isLocked()) {
            throw new IllegalStateException("Season is locked. Participation disabled.");
        }

        Instant now = Instant.now();

        if (now.isBefore(season.getRegistrationStartDate())) {
            throw new IllegalStateException("Registration has not started yet");
        }

        if (now.isAfter(season.getRegistrationEndDate())) {
            throw new IllegalStateException("Registration has ended");
        }

        Participation existing = participationRepository
                .findByAuthIdAndSeasonId(authId, form.getSeasonId())
                .orElse(null);

        if (existing != null) {

            if (!"REJECTED".equals(existing.getStatus())) {
                throw new IllegalStateException("Already applied for this season");
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
                .totalVotes(0)
                .modifiedAt(now)
                .build();

        participationRepository.save(participation);
    }


    /* ---------- LIVE CONTESTANTS ---------- */

    public Page<Participants> getLiveContestants(UUID authId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> result =
                participationRepository.findLiveContestants(authId, pageable);

        return mapParticipants(result);
    }


    /* ---------- APPROVED PARTICIPANTS BY SEASON ---------- */

    public Page<Participants> getApprovedParticipants(
            UUID seasonId,
            UUID authId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> result =
                participationRepository.findApprovedParticipants(
                        seasonId,
                        authId,
                        pageable
                );

        return mapParticipants(result);
    }


    /* ---------- SEARCH LIVE ---------- */

    public Page<Participants> searchLiveContestants(
            String name,
            UUID authId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> result =
                participationRepository.searchLiveApproved(
                        name,
                        authId,
                        pageable
                );

        return mapParticipants(result);
    }


    /* ---------- SEARCH BY SEASON ---------- */

    public Page<Participants> searchParticipantsBySeason(
            UUID seasonId,
            String name,
            UUID authId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> result =
                participationRepository.searchApprovedBySeason(
                        seasonId,
                        name,
                        authId,
                        pageable
                );

        return mapParticipants(result);
    }


    /* ---------- PARTICIPANT DETAILS ---------- */

    public ParticipantById getParticipationById(UUID participationId, UUID authId) {

        return participationRepository.findParticipantById(
                participationId,
                authId
        );
    }


    /* ---------- DELETE PARTICIPATION ---------- */

    public void deleteParticipation(UUID participationId, UUID authId) {

        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new IllegalStateException("Participation not found"));

        if (!participation.getAuthId().equals(authId)) {
            throw new IllegalStateException("Unauthorized");
        }

        participationRepository.delete(participation);
    }

}