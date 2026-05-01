package com.example.backend.seasons;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;
import com.example.backend.seasons.dto.*;
import com.example.backend.participation.Participation;
import com.example.backend.participation.ParticipationRepo;
import com.example.backend.participation.admin.ParticipationAdminRepo;
import com.example.backend.participation.dto.*;
import com.example.backend.participation.dto.base.ParticipantsBase;
import com.example.backend.votes.query.VoteQueryService;
import com.example.backend.votes.query.dto.VoteQuery;
import com.example.backend.config.cloudinary.CloudinaryService;
import com.example.backend.config.redis.RedisService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
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


    // ================= GET FULL season data +participants =================
public SeasonFullResponse getSeasonFull(
        UUID seasonId,
        UUID authId,
        Pageable pageable,
        String order // 👈 new param
) {

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

        // fallback safety (avoid garbage input breaking logic)
        if (!"asc".equalsIgnoreCase(order) && !"desc".equalsIgnoreCase(order)) {
            order = "desc";
        }

        Page<ParticipantsBase> dbPage =
                participationRepo.findApprovedParticipants(seasonId, pageable);

        Page<Participants> enriched =
                enrichParticipants(dbPage, seasonId, authId);

        List<Participants> content = new ArrayList<>(enriched.getContent());

        if ("asc".equalsIgnoreCase(order)) {
            content.sort(Comparator.comparingLong(Participants::score));
        } else {
            content.sort(Comparator.comparingLong(Participants::score).reversed());
        }

        participantsPage = new PageImpl<>(
                content,
                pageable,
                enriched.getTotalElements()
        );
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


    // ================= 🔒 LOCK =================
    redis.opsForValue().set("lock:" + seasonId, "1");

    season.setSeasonEnded(true);
    season.setVotingEndDate(now);

    String leaderboardKey = "l:" + seasonId;
    String voteCountKey = "vc:" + seasonId;
    String killCountKey = "kc:" + seasonId;

    // ================= 📊 GET SORTED =================
    Set<ZSetOperations.TypedTuple<String>> data =
            redis.opsForZSet().reverseRangeWithScores(leaderboardKey, 0, -1);

    if (data != null && !data.isEmpty()) {

        Map<Object, Object> voteCounts = redis.opsForHash().entries(voteCountKey);
        Map<Object, Object> killCounts = redis.opsForHash().entries(killCountKey);

        // 🔥 fetch all participants in ONE query
        List<UUID> ids = data.stream()
                .map(t -> UUID.fromString(t.getValue()))
                .toList();

        Map<UUID, Participation> map =
                participationRepo.findAllById(ids)
                        .stream()
                        .collect(Collectors.toMap(
                                Participation::getParticipationId,
                                p -> p
                        ));

        List<Participation> updates = new ArrayList<>();

        // ================= 🧠 RANK =================
        int rank = 0;
        int position = 0;
        double prevScore = Double.MIN_VALUE;

        for (var t : data) {

            position++;

            UUID pid = UUID.fromString(t.getValue());
            Participation p = map.get(pid);
            if (p == null) continue;

            double scoreVal = t.getScore() == null ? 0 : t.getScore();

            if (scoreVal != prevScore) {
                rank = position;
                prevScore = scoreVal;
            }

            int votes = Integer.parseInt(
                    voteCounts.getOrDefault(pid.toString(), "0").toString()
            );

            int kills = Integer.parseInt(
                    killCounts.getOrDefault(pid.toString(), "0").toString()
            );

            p.setVotes(votes);
            p.setKills(kills);
            p.setScore((long) scoreVal);
            p.setRank(rank); // 🔥 IMPORTANT

            updates.add(p);
        }

        participationRepo.saveAll(updates);
    }

    seasonRepository.save(season);

    // ================= 🧹 CLEAN AFTER COMMIT =================
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