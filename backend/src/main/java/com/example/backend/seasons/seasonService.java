package com.example.backend.seasons;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.UUID;
import com.example.backend.seasons.dto.SeasonForm;
import java.util.List;
import org.springframework.data.redis.core.StringRedisTemplate;
import com.example.backend.participation.admin.ParticipationAdminRepo;
import jakarta.transaction.Transactional;
import com.example.backend.config.cloudinary.CloudinaryService;
import com.example.backend.seasons.dto.SeasonDetails;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;


@Service
@RequiredArgsConstructor
public class seasonService {

    private final SeasonRepo seasonRepository; // repository
    private final CloudinaryService cloudinaryService;
    private final ParticipationAdminRepo participationAdminRepo;
    private final StringRedisTemplate redis;


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


// get seasons list
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



// get single season details
public SeasonDetails getSeasonById(UUID seasonId, UUID authId) {
SeasonDetails season = seasonRepository.findSeasonBySeasonId(seasonId, authId);
if (season == null) {
        throw new IllegalArgumentException("Season not found");
    }
return season;
}









//end season
public void endSeason(UUID seasonId, Instant now) {
Season season = seasonRepository.findById(seasonId)
            .orElseThrow(() -> new IllegalArgumentException("Season not found"));

    season.setVotingEndDate(now); // force season to close
    seasonRepository.save(season);
}



//delete seasons
@Transactional
public void resetSeason(UUID seasonId) {
 // fetch participation ids
    List<UUID> participationIds =
            participationAdminRepo.findParticipationIdsBySeasonId(seasonId);
// build redis vote keys
    List<String> redisKeys = participationIds.stream()
            .map(id -> "votes:participation:" + id)
            .toList();
// delete redis votes
    if (!redisKeys.isEmpty()) {
        redis.delete(redisKeys);
    }
// delete participations from database
     participationAdminRepo.deleteAllBySeasonId(seasonId);
}



//delete season
@Transactional
public void deleteSeason(UUID seasonId) {

    // fetch season
    Season season = seasonRepository.findById(seasonId)
            .orElseThrow(() -> new RuntimeException("Season not found"));

    // get participation ids before deletion
    List<UUID> participationIds =
            participationAdminRepo.findParticipationIdsBySeasonId(seasonId);

    // build redis vote keys
    List<String> redisKeys = participationIds.stream()
            .map(id -> "votes:participation:" + id)
            .toList();

    // delete redis vote counters
    if (!redisKeys.isEmpty()) {
        redis.delete(redisKeys);
    }

    // folder created using season name
    String folder = season.getName()
            .trim()
            .replaceAll("\\s+", "-")
            .toLowerCase();

    String nameFolderPath = "seasons/" + folder;

    // folder created using season UUID
    String idFolderPath = "seasons/" + seasonId;

    // delete images from Cloudinary
    cloudinaryService.deleteFolder(nameFolderPath);
    cloudinaryService.deleteFolder(idFolderPath);

    // delete season from database
    seasonRepository.delete(season);
}
}