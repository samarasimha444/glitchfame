package com.example.backend.participation;

import com.example.backend.auth.*;
import com.example.backend.participation.dto.*;
import com.example.backend.seasons.*;
import com.example.backend.seasons.dto.SeasonDetails;
import com.example.backend.seasons.dto.SeasonFullResponse;
import com.example.backend.votes.dto.*;
import com.example.backend.votes.VoteQueryService;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepo participationRepository;
    private final SeasonRepo seasonRepository;
    private final AuthRepo authRepository;
    private final VoteQueryService voteQueryService;

    /* ---------- MAP PARTICIPANTS + REDIS ---------- */

    private Page<Participants> mapParticipants(Page<Participants> result, UUID authId) {
     List<UUID> ids = result.stream()
                .map(Participants::getParticipationId)
                .toList();
        UUID seasonId = result.getContent().isEmpty()
                ? null
                : result.getContent().get(0).getSeasonId();
        Map<UUID, VoteMeta> voteMetaMap =
                seasonId == null
                        ? new HashMap<>()
                        : voteQueryService.getVoteMetaBatch(ids, seasonId, authId);
        return result.map(p -> {
        VoteMeta meta = voteMetaMap.getOrDefault(
                    p.getParticipationId(),
                    new VoteMeta(0L, false)
            );
        return new ParticipantsImpl(
                    p.getParticipationId(),
                    p.getParticipantName(),
                    p.getParticipantPhotoUrl(),
                    p.getSeasonId(),
                    meta.getVotes(),
                    meta.isHasVoted()
            );
        });
    }

   




    //create participations
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
                .modifiedAt(now)
                .build();

        participationRepository.save(participation);
    }




   
        //live contestants
    public Page<Participants> getLiveContestants(UUID authId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Participants> result =
                participationRepository.findLiveContestants(authId, pageable);
        return mapParticipants(result, authId);
    }






   
    //seach live contestants
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
        return mapParticipants(result, authId);
    }




   
   //search by season
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
                        pageable);
return mapParticipants(result, authId)
;}





public SeasonFullResponse getRandomLiveSeasonWithParticipants(
        UUID authId,
        int page,
        int size
) {

    Instant now = Instant.now();

    Page<SeasonDetails> pageResult =
            seasonRepository.findRandomLiveSeason(
                    authId,
                    now,
                    PageRequest.of(0, 1)
            );

    long total = pageResult.getTotalElements();

    if (total == 0) {
        throw new IllegalStateException("No live season found");
    }

    int randomIndex = new Random().nextInt((int) total);

    SeasonDetails season =
            seasonRepository.findRandomLiveSeason(
                    authId,
                    now,
                    PageRequest.of(randomIndex, 1)
            ).getContent().get(0);

    Pageable pageable = PageRequest.of(page, size);

    Page<Participants> result =
            participationRepository.searchApprovedBySeason(
                    season.getSeasonId(),
                    null,
                    authId,
                    pageable
            );

    Page<Participants> enriched = mapParticipants(result, authId);

    SeasonFullResponse response = new SeasonFullResponse();
    response.setSeason(season);
    response.setParticipants(enriched);

    return response;
}


   //participant by id
    public ParticipantById getParticipationById(UUID participationId, UUID authId) {
 ParticipantById p = participationRepository.findParticipantById(
                participationId,
                authId
        );
if (p == null) return null;
UUID seasonId = p.getSeasonId();
Map<UUID, VoteMeta> metaMap =
                voteQueryService.getVoteMetaBatch(
                        List.of(participationId),
                        seasonId,
                        authId
                );
VoteMeta meta = metaMap.getOrDefault(
                participationId,
                new VoteMeta(0L, false));

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
                meta.getVotes(),
                meta.isHasVoted(),
                p.getSeasonPhotoUrl(),
                p.getRegistrationStartDate(),
                p.getRegistrationEndDate(),
                p.getVotingStartDate(),
                p.getVotingEndDate()
        );
    }


    







   
    //delete partcipation
    public void deleteParticipation(UUID participationId, UUID authId) {
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new IllegalStateException("Participation not found"));
if (!participation.getAuthId().equals(authId)) {
            throw new IllegalStateException("Unauthorized");
        }
participationRepository.delete(participation);
    }
}