package com.example.backend.seasons;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.*;

import com.example.backend.seasons.dto.*;
import com.example.backend.participation.Participation;
import com.example.backend.participation.ParticipationRepo;
import com.example.backend.participation.admin.ParticipationAdminRepo;
import com.example.backend.participation.dto.*;
import com.example.backend.participation.dto.base.ParticipantsBase;
import com.example.backend.votes.query.VoteQueryService;
import com.example.backend.votes.query.dto.VoteQuery;
import com.example.backend.winner.*;
import com.example.backend.config.cloudinary.CloudinaryService;
import com.example.backend.config.redis.RedisService;

import org.springframework.data.redis.core.StringRedisTemplate;
import jakarta.transaction.Transactional;

import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
@Slf4j
@Service
@RequiredArgsConstructor
public class seasonService {

    private final SeasonRepo seasonRepository;
    private final CloudinaryService cloudinaryService;
    private final ParticipationAdminRepo participationAdminRepo;
    private final StringRedisTemplate redis;
    private final WinnerService winnerService;
    private final ParticipationRepo participationRepo;
    private final VoteQueryService voteQueryService;
    private final RedisService redisService;

    // ================= ENRICH =================
    private Page<Participants> enrichParticipants(Page<ParticipantsBase> dbPage, UUID seasonId, UUID authId) {

        if (dbPage.isEmpty()) return dbPage.map(p -> null);

        List<UUID> ids = dbPage.stream()
                .map(ParticipantsBase::participationId)
                .toList();

        Map<UUID, VoteQuery> metaMap =
                voteQueryService.getMetaBatch(ids, seasonId, authId);

        return dbPage.map(p -> {

            VoteQuery meta = metaMap.getOrDefault(
                    p.participationId(),
                    new VoteQuery(0L, 0L, 0, 0, false, false)
            );

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
    public Season createSeason(SeasonForm form) {

        Instant regStart = form.getRegistrationStartDate().toInstant();
        Instant regEnd = form.getRegistrationEndDate().toInstant();
        Instant voteStart = form.getVotingStartDate().toInstant();
        Instant voteEnd = form.getVotingEndDate().toInstant();

        if (seasonRepository.existsByName(form.getName())) {
            throw new IllegalArgumentException("Season name already exists");
        }

        if (!regStart.isBefore(regEnd)) throw new IllegalArgumentException("Invalid registration dates");
        if (voteStart.isBefore(regStart)) throw new IllegalArgumentException("Voting must start after registration");
        if (voteEnd.isBefore(regEnd)) throw new IllegalArgumentException("Voting must end after registration");
        if (voteEnd.isBefore(voteStart)) throw new IllegalArgumentException("Invalid voting range");

        Season season = new Season();
        season.setName(form.getName());
        season.setDescription(form.getDescription());
        season.setPrize(form.getPrize());
        season.setPhotoUrl(form.getPhotoUrl());
        season.setRegistrationStartDate(regStart);
        season.setRegistrationEndDate(regEnd);
        season.setVotingStartDate(voteStart);
        season.setVotingEndDate(voteEnd);

        Season saved = seasonRepository.save(season);

        redisService.register(saved.getSeasonId(), "l:" + saved.getSeasonId());
        redisService.register(saved.getSeasonId(), "vc:" + saved.getSeasonId());
        redisService.register(saved.getSeasonId(), "kc:" + saved.getSeasonId());
        redisService.register(saved.getSeasonId(), "lock:" + saved.getSeasonId());

        return saved;
    }

    // ================= ADJUST DATES =================
    public void adjustDates(UUID seasonId,
                            OffsetDateTime registrationStart,
                            OffsetDateTime registrationEnd,
                            OffsetDateTime votingStart,
                            OffsetDateTime votingEnd) {

        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new IllegalArgumentException("Season not found"));

        Instant regStart = registrationStart != null ? registrationStart.toInstant() : season.getRegistrationStartDate();
        Instant regEnd = registrationEnd != null ? registrationEnd.toInstant() : season.getRegistrationEndDate();
        Instant voteStart = votingStart != null ? votingStart.toInstant() : season.getVotingStartDate();
        Instant voteEnd = votingEnd != null ? votingEnd.toInstant() : season.getVotingEndDate();

        if (!regStart.isBefore(regEnd)) throw new IllegalArgumentException("Invalid registration dates");
        if (voteStart.isBefore(regStart)) throw new IllegalArgumentException("Invalid voting start");
        if (voteEnd.isBefore(regEnd)) throw new IllegalArgumentException("Invalid voting end");
        if (voteEnd.isBefore(voteStart)) throw new IllegalArgumentException("Invalid voting range");

        season.setRegistrationStartDate(regStart);
        season.setRegistrationEndDate(regEnd);
        season.setVotingStartDate(voteStart);
        season.setVotingEndDate(voteEnd);

        seasonRepository.save(season);
    }

    // ================= UPDATE PRIZE =================
    public void updatePrize(UUID seasonId, String prize) {

        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new IllegalArgumentException("Season not found"));

        if (prize == null || prize.isBlank()) {
            throw new IllegalArgumentException("Prize cannot be empty");
        }

        season.setPrize(prize);
        seasonRepository.save(season);
    }

    // ================= LOCK =================
    public boolean toggleSeasonLock(UUID seasonId) {

        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new IllegalArgumentException("Season not found"));

        boolean newState = !season.isLocked();
        season.setLocked(newState);
        seasonRepository.save(season);

        String lockKey = "lock:" + seasonId;

        if (newState) {
            redis.opsForValue().set(lockKey, "1");
        } else {
            redis.delete(lockKey);
        }

        redisService.register(seasonId, lockKey);

        return newState;
    }

    // ================= GET SEASONS =================
    public Page<SeasonDetails> getSeasons(UUID authId, String type, int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("registrationStartDate").descending());

        return seasonRepository.findSeasons(
                authId,
                type.toUpperCase(),
                Instant.now(),
                pageable
        );
    }

    // ================= GET FULL =================
    public SeasonFullResponse getSeasonFull(UUID seasonId, UUID authId, Pageable pageable) {

        SeasonDetails season =
                seasonRepository.findSeasonBySeasonId(seasonId, authId);

        if (season == null) throw new RuntimeException("Season not found");

        Instant now = Instant.now();

        boolean isVotingActive =
                season.getVotingStartDate() != null &&
                season.getVotingEndDate() != null &&
                !now.isBefore(season.getVotingStartDate()) &&
                !now.isAfter(season.getVotingEndDate());

        Page<Participants> participantsPage = Page.empty();

        if (isVotingActive) {
            Page<ParticipantsBase> dbPage =
                    participationRepo.findApprovedParticipants(seasonId, pageable);

            participantsPage = enrichParticipants(dbPage, seasonId, authId);
        }

        SeasonFullResponse response = new SeasonFullResponse();
        response.setSeason(season);
        response.setParticipants(participantsPage);

        return response;
    }

    // ================= END SEASON =================
    @Transactional
    public void endSeason(UUID seasonId, Instant now) {

        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new IllegalArgumentException("Season not found"));

        if (season.isSeasonEnded()) return;

        season.setSeasonEnded(true);
        season.setVotingEndDate(now);

        String leaderboardKey = "l:" + seasonId;
        String voteCountKey = "vc:" + seasonId;
        String killCountKey = "kc:" + seasonId;

        Set<String> participantIds =
                redis.opsForZSet().range(leaderboardKey, 0, -1);

        if (participantIds != null && !participantIds.isEmpty()) {

            Map<Object, Object> voteCounts = redis.opsForHash().entries(voteCountKey);
            Map<Object, Object> killCounts = redis.opsForHash().entries(killCountKey);

            List<Participation> updates = new ArrayList<>();

            for (String pidStr : participantIds) {

                UUID participationId = UUID.fromString(pidStr);

                Participation p = participationRepo.findById(participationId).orElse(null);
                if (p == null) continue;

                int votes = Integer.parseInt(voteCounts.getOrDefault(pidStr, "0").toString());
                int kills = Integer.parseInt(killCounts.getOrDefault(pidStr, "0").toString());

                Double scoreObj = redis.opsForZSet().score(leaderboardKey, pidStr);
                long score = (scoreObj == null) ? 0 : scoreObj.longValue();

                p.setVotes(votes);
                p.setKills(kills);
                p.setScore(score);

                updates.add(p);
            }

            participationRepo.saveAll(updates);
        }

        seasonRepository.save(season);

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCommit() {
                        redisService.deleteSeason(seasonId);
                    }
                }
        );
    }

    // ================= RESET =================
    @Transactional
    public void resetSeason(UUID seasonId) {

        redisService.deleteSeason(seasonId);
        cloudinaryService.deleteFolder("seasons/" + seasonId + "/contestants");
        participationAdminRepo.deleteAllBySeasonId(seasonId);
    }

    // ================= DELETE =================
    @Transactional
    public void deleteSeason(UUID seasonId) {

        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found"));

        redisService.deleteSeason(seasonId);

        String folder = season.getName().trim().replaceAll("\\s+", "-").toLowerCase();

        cloudinaryService.deleteFolder("seasons/" + folder);
        cloudinaryService.deleteFolder("seasons/" + seasonId);

        seasonRepository.delete(season);
    }
}