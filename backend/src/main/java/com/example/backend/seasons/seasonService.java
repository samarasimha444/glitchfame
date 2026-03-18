package com.example.backend.seasons;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;
import com.example.backend.seasons.dto.SeasonForm;
import com.example.backend.seasons.dto.SeasonFullResponse;
import com.example.backend.votes.VoteQueryService;
import com.example.backend.votes.dto.VoteMeta;
import com.example.backend.winner.Winner;
import com.example.backend.winner.WinnerService;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

import org.springframework.data.redis.core.StringRedisTemplate;

import com.example.backend.participation.ParticipationRepo;

import com.example.backend.participation.admin.ParticipationAdminRepo;
import com.example.backend.participation.dto.Participants;
import com.example.backend.participation.dto.ParticipantsImpl;

import jakarta.transaction.Transactional;
import com.example.backend.config.cloudinary.CloudinaryService;
import com.example.backend.seasons.dto.SeasonDetails;

import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;


@Slf4j
@Service
@RequiredArgsConstructor
public class seasonService {

    private final SeasonRepo seasonRepository; // repository
    private final CloudinaryService cloudinaryService;
    private final ParticipationAdminRepo participationAdminRepo;
    private final StringRedisTemplate redis;
    private final WinnerService winnerService;
    private final ParticipationRepo participationRepo;
    private final VoteQueryService voteQueryService;



// create season
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

    return seasonRepository.save(season);
}


//update votes
public void adjustDates(UUID seasonId,
                        OffsetDateTime registrationStart,
                        OffsetDateTime registrationEnd,
                        OffsetDateTime votingStart,
                        OffsetDateTime votingEnd) {

    Season season = seasonRepository.findById(seasonId)
            .orElseThrow(() -> new IllegalArgumentException("Season not found"));

    // convert incoming values to Instant
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


    // same comparisons style as createSeason()

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


    // apply updates
    if (registrationStart != null) {
        season.setRegistrationStartDate(newRegistrationStart);
    }
    if (registrationEnd != null) {
        season.setRegistrationEndDate(newRegistrationEnd);
    }
    if (votingStart != null) {
        season.setVotingStartDate(newVotingStart);
    }
    if (votingEnd != null) {
        season.setVotingEndDate(newVotingEnd);
    }
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
season.setLocked(!season.isLocked()); // flip state
seasonRepository.save(season);
return season.isLocked(); // return new state
}




// get seasons list LIVE/ALL/LIVE_UPCOMING
public Page<SeasonDetails> getSeasons(UUID authId, String type, int page, int size) {
Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by("registrationStartDate").descending() // newest first
    );
return seasonRepository.findSeasons(
            authId,
            type.toUpperCase(),
            Instant.now(),
            pageable
    );
}



public SeasonFullResponse getSeasonFull(
        UUID seasonId,
        UUID authId,
        Pageable pageable
) {

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
                participationRepo.findApprovedParticipants(seasonId, authId, pageable);

        List<UUID> ids = dbPage.stream()
                .map(Participants::getParticipationId)
                .toList();

        Map<UUID, VoteMeta> voteMetaMap =
                voteQueryService.getVoteMetaBatch(ids, seasonId, authId);

        participantsPage = dbPage.map(p -> {

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

    SeasonFullResponse response = new SeasonFullResponse();
    response.setSeason(season);
    response.setParticipants(participantsPage);

    return response;
}









@Transactional
public void endSeason(UUID seasonId, Instant now) {

    Season season = seasonRepository.findById(seasonId)
            .orElseThrow(() -> new IllegalArgumentException("Season not found"));

    if (season.isSeasonEnded()) return; // prevent duplicate execution

    season.setSeasonEnded(true);
    season.setVotingEndDate(now);

    // 1. calculate winner
    Winner winner = winnerService.calculateWinner(seasonId, season);

    // 2. cleanup first (IMPORTANT)
    resetSeason(seasonId);

    // 3. move winner image safely
    if (winner != null && winner.getParticipantPhoto() != null) {
        try {
           String oldPublicId = cloudinaryService.extractPublicId(
        winner.getParticipantPhoto()
);

            String newUrl = cloudinaryService.moveImage(
                    oldPublicId,
                    "home/winners/" + seasonId + "/winner"
            );

            winner.setParticipantPhoto(newUrl);

        } catch (Exception e) {
            log.error("Cloudinary move failed for season {}", seasonId, e);
        }
    }

    seasonRepository.save(season);
}








@Transactional
public void resetSeason(UUID seasonId) {

    // 1. delete leaderboard
    redis.delete("leaderboard:season:" + seasonId);

    // 2. delete all user votes
    Set<String> userVoteKeys = redis.keys("votes:user:" + seasonId + ":*");

    if (userVoteKeys != null && !userVoteKeys.isEmpty()) {
        redis.delete(userVoteKeys);
    }

    // 3. delete ONLY contestant images (not winners)
    cloudinaryService.deleteFolder("seasons/" + seasonId + "/contestants");
   

    // 4. delete participants from DB
    participationAdminRepo.deleteAllBySeasonId(seasonId);
}



//delete season
@Transactional
public void deleteSeason(UUID seasonId) {

    Season season = seasonRepository.findById(seasonId)
            .orElseThrow(() -> new RuntimeException("Season not found"));

    List<UUID> participationIds =
            participationAdminRepo.findParticipationIdsBySeasonId(seasonId);

    List<String> redisKeys = participationIds.stream()
            .map(id -> "votes:participation:" + id)
            .toList();

    if (!redisKeys.isEmpty()) {
        redis.delete(redisKeys);
    }




    // delete leaderboard
    redis.delete("leaderboard:season:" + seasonId);
    redis.opsForSet().remove("leaderboard:seasons", seasonId.toString());

    String folder = season.getName()
            .trim()
            .replaceAll("\\s+", "-")
            .toLowerCase();

    String nameFolderPath = "seasons/" + folder;
    String idFolderPath = "seasons/" + seasonId;

    cloudinaryService.deleteFolder(nameFolderPath); // banner
    cloudinaryService.deleteFolder(idFolderPath);   // contestants

    seasonRepository.delete(season); // cascade removes participants
}
}