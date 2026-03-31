package com.example.backend.participation;

import com.example.backend.auth.*;
import com.example.backend.participation.dto.*;
import com.example.backend.participation.dto.base.ParticipantByIdBase;
import com.example.backend.participation.dto.base.ParticipantsBase;
import com.example.backend.seasons.*;
import com.example.backend.seasons.dto.*;
import com.example.backend.votes.query.VoteQueryService;
import com.example.backend.votes.query.dto.VoteQuery;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ParticipationService {

    private final ParticipationRepo participationRepository;
    private final SeasonRepo seasonRepository;
    private final AuthRepo authRepository;
    private final VoteQueryService voteQueryService;

    // ================= MAP PARTICIPANTS =================
    private Page<Participants> mapParticipants(Page<ParticipantsBase> result, UUID authId) {

        if (result.isEmpty()) return result.map(p -> null);

        Map<UUID, List<ParticipantsBase>> grouped =
                result.getContent().stream()
                        .collect(Collectors.groupingBy(ParticipantsBase::seasonId));

        Map<UUID, VoteQuery> finalMetaMap = new HashMap<>();

        for (Map.Entry<UUID, List<ParticipantsBase>> entry : grouped.entrySet()) {

            UUID seasonId = entry.getKey();

            List<UUID> ids = entry.getValue().stream()
                    .map(ParticipantsBase::participationId)
                    .toList();

            Map<UUID, VoteQuery> partial =
                    voteQueryService.getMetaBatch(ids, seasonId, authId);

            finalMetaMap.putAll(partial);
        }

        return result.map(p -> {

            VoteQuery meta = finalMetaMap.get(p.participationId());

            if (meta == null) {
                log.warn("Missing Redis data for participationId={}", p.participationId());
                meta = new VoteQuery(0L, 0L, 0, 0, false, false);
            }

            return new Participants(
                    p.participationId(),
                    p.participantName(),
                    p.participantPhotoUrl(),
                    p.seasonId(),
                    meta.getScore(),
                    meta.getRank(),
                    meta.getVoteCount(),
                    meta.getKillCount(),
                    meta.isHasVoted(),
                    meta.isHasKilled()
            );
        });
    }

    // ================= CREATE =================
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

    // ================= LIVE =================
    public Page<Participants> getLiveContestants(UUID authId, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);

        Page<ParticipantsBase> result =
                participationRepository.findLiveContestants(pageable);

        return mapParticipants(result, authId);
    }

    // ================= SEARCH LIVE =================
    public Page<Participants> searchLiveContestants(
            String name,
            UUID authId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<ParticipantsBase> result =
                participationRepository.searchLiveApproved(name, pageable);

        return mapParticipants(result, authId);
    }

    // ================= SEARCH BY SEASON =================
    public Page<Participants> searchParticipantsBySeason(
            UUID seasonId,
            String name,
            UUID authId,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size);

        Page<ParticipantsBase> result =
                participationRepository.searchApprovedBySeason(seasonId, name, pageable);

        return mapParticipants(result, authId);
    }

    // ================= RANDOM SEASON =================
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

        Page<ParticipantsBase> participants =
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


    
    // ================= GET BY ID =================
public ParticipantById getParticipationById(UUID participationId, UUID authId) {

    ParticipantByIdBase p =
            participationRepository.findParticipantById(participationId);

    if (p == null) return null;

    Map<UUID, VoteQuery> metaMap =
            voteQueryService.getMetaBatch(
                    List.of(participationId),
                    p.getSeasonId(),
                    authId
            );

    VoteQuery meta = metaMap.getOrDefault(
            participationId,
            new VoteQuery(0L, 0L, 0, 0, false, false)
    );

    return new ParticipantById(
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
            meta.getScore(),
            meta.getRank(),
            meta.getVoteCount(),
            meta.getKillCount(),
            meta.isHasVoted(),
            meta.isHasKilled(),
            p.getSeasonPhotoUrl(),

            // 🔥 Instant → LocalDateTime (UTC)
            toLocal(p.getRegistrationStartDate()),
            toLocal(p.getRegistrationEndDate()),
            toLocal(p.getVotingStartDate()),
            toLocal(p.getVotingEndDate())
    );
}


// ================= HELPER =================
private LocalDateTime toLocal(Instant instant) {
    return instant == null
            ? null
            : LocalDateTime.ofInstant(instant, ZoneOffset.UTC);
}



//track my applications
public Page<TrackMyApplicationsResponse> getMyApplications(UUID authId, int page, int size) {

    Pageable pageable = PageRequest.of(page, size);

    Page<TrackMyApplications> dbPage =
            participationRepository.findMyApplications(authId, pageable);

    List<TrackMyApplications> list = dbPage.getContent();

    // ================= GROUP BY SEASON =================
    Map<UUID, List<TrackMyApplications>> grouped =
            list.stream().collect(Collectors.groupingBy(TrackMyApplications::getSeasonId));

    Map<UUID, VoteQuery> metaMap = new HashMap<>();

    // ================= FETCH REDIS ONLY FOR LIVE =================
    for (Map.Entry<UUID, List<TrackMyApplications>> entry : grouped.entrySet()) {

        UUID seasonId = entry.getKey();
        TrackMyApplications sample = entry.getValue().get(0);

        boolean isLive =
                !sample.getVotingStartDate().isAfter(LocalDateTime.now()) &&
                !sample.getVotingEndDate().isBefore(LocalDateTime.now());

        if (!isLive) continue;

        List<UUID> ids = entry.getValue()
                .stream()
                .map(TrackMyApplications::getParticipationId)
                .toList();

        Map<UUID, VoteQuery> partial =
                voteQueryService.getMetaBatch(ids, seasonId, authId);

        metaMap.putAll(partial);
    }

    // ================= MAP FINAL RESPONSE =================
    List<TrackMyApplicationsResponse> content = list.stream().map(p -> {

        VoteQuery meta = metaMap.get(p.getParticipationId());

        int votes = p.getVotes() == null ? 0 : p.getVotes();
        int kills = p.getKills() == null ? 0 : p.getKills();
        long score = p.getScore() == null ? 0 : p.getScore();
        Integer rank = p.getRank(); // DB only

        // override only if live
        if (meta != null) {
            votes = meta.getVoteCount();
            kills = meta.getKillCount();
            score = meta.getScore();
        }

        return new TrackMyApplicationsResponse(
                p.getParticipationId(),
                p.getSeasonId(),
                p.getParticipantName(),
                p.getParticipantPhotoUrl(),
                p.getStatus(),
                p.getSeasonName(),
                p.getRegistrationStartDate(),
                p.getRegistrationEndDate(),
                p.getVotingStartDate(),
                p.getVotingEndDate(),
                votes,
                kills,
                score,
                rank
        );
    }).toList();

    return new PageImpl<>(content, pageable, dbPage.getTotalElements());
}





    // ================= DELETE =================
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