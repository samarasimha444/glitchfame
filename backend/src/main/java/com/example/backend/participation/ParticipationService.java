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


    // batch fetch votes from redis
    private Map<UUID, Long> getVotesBatch(List<UUID> participationIds) {

        List<String> keys = participationIds.stream()
                .map(id -> "votes:participation:" + id)
                .toList();

        List<String> values = redis.opsForValue().multiGet(keys);

        Map<UUID, Long> votes = new HashMap<>();

        for (int i = 0; i < participationIds.size(); i++) {

            String value = values != null ? values.get(i) : null;

            votes.put(
                    participationIds.get(i),
                    value != null ? Long.parseLong(value) : 0
            );
        }

        return votes;
    }


    // map projection + redis votes
    private Page<Participants> mapParticipants(Page<Participants> result) {

        List<UUID> ids = result.stream()
                .map(Participants::getParticipationId)
                .toList();

        Map<UUID, Long> voteMap = getVotesBatch(ids);

        return result.map(p -> new ParticipantsImpl(
                p.getParticipationId(),
                p.getParticipantName(),
                p.getParticipantPhotoUrl(),
                p.getSeasonId(),
                voteMap.getOrDefault(p.getParticipationId(), 0L),
                p.getHasVoted()
        ));
    }


    // create participation or reapply if rejected
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


    // get contestants from live seasons
    public Page<Participants> getLiveContestants(UUID authId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<Participants> result =
                participationRepository.findLiveContestants(authId, pageable);

        return mapParticipants(result);
    }


    // get approved contestants of a season
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


    // search live contestants
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


    // search contestants inside season
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


    // get participant details
    public ParticipantById getParticipationById(UUID participationId, UUID authId) {

        return participationRepository.findParticipantById(
                participationId,
                authId
        );
    }


    // delete participation if owner
    public void deleteParticipation(UUID participationId, UUID authId) {

        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new IllegalStateException("Participation not found"));

        if (!participation.getAuthId().equals(authId)) {
            throw new IllegalStateException("Unauthorized");
        }

        participationRepository.delete(participation);
    }

}