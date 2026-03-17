package com.example.backend.participation;

import com.example.backend.auth.*;
import com.example.backend.participation.dto.*;
import com.example.backend.seasons.*;
import com.example.backend.seasons.dto.RandomLiveSeasonDTO;
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
                .modifiedAt(now)
                .build();

        participationRepository.save(participation);
    }

    /* ---------- LIVE CONTESTANTS ---------- */

    public Page<Participants> getLiveContestants(UUID authId, int page, int size) {
Pageable pageable = PageRequest.of(page, size);
Page<Participants> result =
                participationRepository.findLiveContestants(authId, pageable);
return mapParticipants(result, authId);
    }



    /* ---------- RANDOM LIVE SEASON ---------- */

    public RandomLiveSeasonDTO getRandomLiveSeason(UUID authId) {
 Season season = seasonRepository.findRandomLiveSeasonEntity();
 if (season == null) {
            return null;}

        List<Participation> contestants =
                participationRepository.findApprovedContestants(season.getSeasonId());
 List<UUID> ids = contestants.stream()
                .map(Participation::getParticipationId)
                .toList();

        Map<UUID, VoteMeta> voteMetaMap =
                voteQueryService.getVoteMetaBatch(ids, season.getSeasonId(), authId);

        List<ContestantDTO> contestantDTOs = contestants.stream()
                .map(p -> {

                    VoteMeta meta = voteMetaMap.getOrDefault(
                            p.getParticipationId(),
                            new VoteMeta(0L, false)
                    );

                    return ContestantDTO.builder()
                            .participationId(p.getParticipationId())
                            .name(p.getName())
                            .photoUrl(p.getPhotoUrl())
                            .votes(meta.getVotes())
                            .hasVoted(meta.isHasVoted())
                            .build();
                })
                .toList();

        return RandomLiveSeasonDTO.builder()
                .seasonId(season.getSeasonId())
                .seasonName(season.getName())
                .seasonPhotoUrl(season.getPhotoUrl())
                .votingStartDate(season.getVotingStartDate())
                .votingEndDate(season.getVotingEndDate())
                .contestants(contestantDTOs)
                .build();
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

        return mapParticipants(result, authId);
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

        return mapParticipants(result, authId);
    }

    /* ---------- PARTICIPANT DETAILS ---------- */

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
                new VoteMeta(0L, false)
        );

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