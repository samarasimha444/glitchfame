package com.example.backend.seasons;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.*;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.*;
import com.example.backend.seasons.dto.*;
import com.example.backend.participation.ParticipationRepo;
import com.example.backend.participation.admin.ParticipationAdminRepo;
import com.example.backend.participation.dto.*;
import com.example.backend.votes.*;
import com.example.backend.votes.dto.VoteMeta;
import com.example.backend.winner.*;
import com.example.backend.config.cloudinary.CloudinaryService;
import com.example.backend.config.redis.RedisService;
import org.springframework.data.redis.core.StringRedisTemplate;
import jakarta.transaction.Transactional;







@Slf4j
@Service
@RequiredArgsConstructor
public class seasonService { 
    

    //dependency injection
    private final SeasonRepo seasonRepository;
    private final CloudinaryService cloudinaryService;
    private final ParticipationAdminRepo participationAdminRepo;
    private final StringRedisTemplate redis;
    private final WinnerService winnerService;
    private final ParticipationRepo participationRepo;
    private final VoteQueryService voteQueryService;
    private final RedisService redisService;
    




    // ✅ common enrichment logic (clean + lambda-safe)
    private Page<Participants> enrichParticipants(Page<Participants> dbPage, UUID seasonId, UUID authId) {

        List<UUID> participationIds = dbPage.stream()
                .map(Participants::getParticipationId)
                .toList();

        Map<UUID, VoteMeta> voteMetaMap =
                (authId != null && !participationIds.isEmpty())
                        ? voteQueryService.getVoteMetaBatch(participationIds, seasonId, authId)
                        : Collections.emptyMap();

        return dbPage.map(p -> {

            VoteMeta meta = voteMetaMap.getOrDefault(
                    p.getParticipationId(),
                    new VoteMeta(
                            p.getTotalVotes() == null ? 0 : p.getTotalVotes(), // ✅ FIXED
                            false
                    )
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




// create a new season
public Season createSeason(SeasonForm form) {

    Instant registrationStart = form.getRegistrationStartDate().toInstant();
    Instant registrationEnd = form.getRegistrationEndDate().toInstant();
    Instant votingStart = form.getVotingStartDate().toInstant();
    Instant votingEnd = form.getVotingEndDate().toInstant();

    if (seasonRepository.existsByName(form.getName())) {
        throw new IllegalArgumentException("Season name already exists");
    }

    if (!registrationStart.isBefore(registrationEnd)) {
        throw new IllegalArgumentException("registrationEnd must be after registrationStart");
    }

    if (votingStart.isBefore(registrationStart)) {
        throw new IllegalArgumentException("votingStart must be after or equal to registrationStart");
    }

    if (votingEnd.isBefore(registrationEnd)) {
        throw new IllegalArgumentException("votingEnd must be after or equal to registrationEnd");
    }

    if (votingEnd.isBefore(votingStart)) {
        throw new IllegalArgumentException("votingEnd must be after or equal to votingStart");
    }

    Season season = new Season();
    season.setName(form.getName());
    season.setDescription(form.getDescription());
    season.setPrize(form.getPrize());
    season.setPhotoUrl(form.getPhotoUrl());
    season.setRegistrationStartDate(registrationStart);
    season.setRegistrationEndDate(registrationEnd);
    season.setVotingStartDate(votingStart);
    season.setVotingEndDate(votingEnd);

    // ✅ Save first
    Season saved = seasonRepository.save(season);

    // ✅ Register Redis keys (COLD PATH - runs once)
    redisService.registerSeasonKey(
            saved.getSeasonId(),
            "leaderboard:season:" + saved.getSeasonId()
    );

    return saved;
}




    // update season dates
    public void adjustDates(UUID seasonId,
                            OffsetDateTime registrationStart,
                            OffsetDateTime registrationEnd,
                            OffsetDateTime votingStart,
                            OffsetDateTime votingEnd) {

        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new IllegalArgumentException("Season not found"));

        Instant newRegistrationStart = registrationStart != null
                ? registrationStart.toInstant()
                : season.getRegistrationStartDate();

        Instant newRegistrationEnd = registrationEnd != null
                ? registrationEnd.toInstant()
                : season.getRegistrationEndDate();

        Instant newVotingStart = votingStart != null
                ? votingStart.toInstant()
                : season.getVotingStartDate();

        Instant newVotingEnd = votingEnd != null
                ? votingEnd.toInstant()
                : season.getVotingEndDate();

        if (!newRegistrationStart.isBefore(newRegistrationEnd)) {
            throw new IllegalArgumentException("registrationEnd must be after registrationStart");
        }

        if (newVotingStart.isBefore(newRegistrationStart)) {
            throw new IllegalArgumentException("votingStart must be after or equal to registrationStart");
        }

        if (newVotingEnd.isBefore(newRegistrationEnd)) {
            throw new IllegalArgumentException("votingEnd must be after or equal to registrationEnd");
        }

        if (newVotingEnd.isBefore(newVotingStart)) {
            throw new IllegalArgumentException("votingEnd must be after or equal to votingStart");
        }

        if (registrationStart != null) season.setRegistrationStartDate(newRegistrationStart);
        if (registrationEnd != null) season.setRegistrationEndDate(newRegistrationEnd);
        if (votingStart != null) season.setVotingStartDate(newVotingStart);
        if (votingEnd != null) season.setVotingEndDate(newVotingEnd);

        seasonRepository.save(season);
    }





    // update prize
    public void updatePrize(UUID seasonId, String prize) {

        Season season = seasonRepository.findById(seasonId)
                .orElseThrow(() -> new IllegalArgumentException("Season not found"));

        if (prize == null || prize.isBlank()) {
            throw new IllegalArgumentException("Prize cannot be empty");
        }

        season.setPrize(prize);
        seasonRepository.save(season);
    }





   // toggle season lock
public boolean toggleSeasonLock(UUID seasonId) {
Season season = seasonRepository.findById(seasonId)
            .orElseThrow(() -> new IllegalArgumentException("Season not found"));
 // toggle
    boolean newState = !season.isLocked();
    season.setLocked(newState);
// save to DB (source of truth)
    seasonRepository.save(season);
 // ✅ sync to Redis
    String lockKey = "season:locked:" + seasonId;
if (newState) {
        redis.opsForValue().set(lockKey, "1");
    } else {
        redis.delete(lockKey);
    }
 return newState;
}






    // get seasons list
    public Page<SeasonDetails> getSeasons(UUID authId, String type, int page, int size) {
     Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("registrationStartDate").descending()
        );
     return seasonRepository.findSeasons(
                authId,
                type.toUpperCase(),
                Instant.now(),
                pageable
        );
    }





    // get full season with participants
    public SeasonFullResponse getSeasonFull(UUID seasonId, UUID authId, Pageable pageable) {
    SeasonDetails season =
                seasonRepository.findSeasonBySeasonId(seasonId, authId);

        if (season == null) {
            throw new RuntimeException("Season not found");
        }

        Instant now = Instant.now();

        boolean isVotingActive =
                season.getVotingStartDate() != null &&
                season.getVotingEndDate() != null &&
                !now.isBefore(season.getVotingStartDate()) &&
                !now.isAfter(season.getVotingEndDate());

        Page<Participants> participantsPage = Page.empty();

        if (isVotingActive) {

            Page<Participants> dbPage =
                    participationRepo.findApprovedParticipants(seasonId, pageable);

            participantsPage = enrichParticipants(dbPage, seasonId, authId); // ✅ CLEAN
        }

        SeasonFullResponse response = new SeasonFullResponse();
        response.setSeason(season);
        response.setParticipants(participantsPage);

        return response;
    }





//end season manually  and automatic
@Transactional
public void endSeason(UUID seasonId, Instant now) {

    Season season = seasonRepository.findById(seasonId)
            .orElseThrow(() -> new IllegalArgumentException("Season not found"));

    if (season.isSeasonEnded()) return;

    // ✅ mark season ended
    season.setSeasonEnded(true);
    season.setVotingEndDate(now);

    // ✅ calculate winner BEFORE cleanup
    Winner winner = winnerService.calculateWinner(seasonId, season);

    // ✅ move winner image
    if (winner != null && winner.getParticipantPhoto() != null) {
        try {
            String oldPublicId = cloudinaryService.extractPublicId(winner.getParticipantPhoto());

            String newUrl = cloudinaryService.moveImage(
                    oldPublicId,
                    "home/winners/" + seasonId + "/winner"
            );

            winner.setParticipantPhoto(newUrl);

        } catch (Exception e) {
            log.error("Cloudinary move failed for season {}", seasonId, e);
        }
    }

    // ✅ FULL REDIS CLEANUP (single source of truth)
    redisService.deleteSeasonData(seasonId);

 // ✅ delete all contestant images
    cloudinaryService.deleteFolder("seasons/" + seasonId + "/contestants");

    // ✅ delete participants from DB
    participationAdminRepo.deleteAllBySeasonId(seasonId);

    // ✅ save season last
    seasonRepository.save(season);
}





//reset season
@Transactional
public void resetSeason(UUID seasonId) {

    // ✅ wipe all Redis data using registry
    redisService.deleteSeasonData(seasonId);
     // cloud cleanup
    cloudinaryService.deleteFolder("seasons/" + seasonId + "/contestants");

    // DB cleanup (participants only, season stays)
    participationAdminRepo.deleteAllBySeasonId(seasonId);
}





//delete season
  @Transactional
public void deleteSeason(UUID seasonId) {

    Season season = seasonRepository.findById(seasonId)
            .orElseThrow(() -> new RuntimeException("Season not found"));

    // ✅ CLEAN REDIS (single source of truth)
    redisService.deleteSeasonData(seasonId);

// cloud cleanup
    String folder = season.getName()
            .trim()
            .replaceAll("\\s+", "-")
            .toLowerCase();

    cloudinaryService.deleteFolder("seasons/" + folder);
    cloudinaryService.deleteFolder("seasons/" + seasonId);

    // DB delete (last)
    seasonRepository.delete(season);
}
}