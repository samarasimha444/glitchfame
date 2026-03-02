package com.example.glitchfame.Seasons;

import com.example.glitchfame.Seasons.DTO.*;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeasonsService {

    private final SeasonsRepository seasonsRepository;
    private final ExtractJwtData extractJwtData;
    private final CloudinaryService cloudinaryService;

    /*
     -------------------------------------------------
     1️⃣ GET SEASONS BY STATUS (MERGED LOGIC)
     -------------------------------------------------
    */
  public List<SeasonsDTO> getSeasons(String status) {

    Long userId = extractJwtData.getUserId();

    // If no status → return all seasons
    if (status == null || status.trim().isEmpty()) {
        return seasonsRepository.getSeasonsByStatus(null, userId);
    }

    String normalized = status.trim().toUpperCase();

    if (!normalized.equals("UPCOMING") &&
        !normalized.equals("LIVE") &&
        !normalized.equals("PAST")) {
        throw new IllegalArgumentException("Invalid season status");
    }

    return seasonsRepository.getSeasonsByStatus(normalized, userId);
}
    /*
     -------------------------------------------------
     2️⃣ GET SEASON DETAILS
     -------------------------------------------------
    */
    public SeasonDetailsDTO getSeasonDetails(Long seasonId) {

        Long userId = extractJwtData.getUserId();

        SeasonDetailsDTO season =
                seasonsRepository.findSeasonDetailsById(seasonId, userId);

        if (season == null) {
            throw new RuntimeException("Season not found");
        }

        return season;
    }

  /*
 -------------------------------------------------
 3️⃣ SEARCH SEASONS BY NAME + STATUS
 Example:
 /seasons/search?name=Li&status=LIVE
 -------------------------------------------------
*/
public List<SeasonsByNameDTO> searchSeasonsByName(String name, String status) {

    if (name == null || status == null) {
        return List.of();
    }

    String search = name.trim();
    String seasonStatus = status.trim().toUpperCase();

    if (search.length() < 2) {
        return List.of();
    }

    // Validate status properly
    if (!seasonStatus.equals("LIVE") &&
        !seasonStatus.equals("PAST") &&
        !seasonStatus.equals("UPCOMING")) {
        throw new IllegalArgumentException("Invalid season status");
    }

    return seasonsRepository.findSeasonsByNameContaining(
            search,
            seasonStatus
    );
}
  


//create season
    @Transactional
    public String createSeason(SeasonFormDTO dto) {

        LocalDateTime now = LocalDateTime.now();

        String name = dto.getName().trim();

        if (seasonsRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Season name already exists");
        }

        if (dto.getRegistrationStartDate().isBefore(now)) {
            throw new IllegalArgumentException("Registration start date cannot be in the past");
        }

        if (dto.getRegistrationStartDate().isAfter(dto.getRegistrationEndDate())) {
            throw new IllegalArgumentException("Registration end must be after registration start");
        }

        if (dto.getRegistrationEndDate().isAfter(dto.getVotingStartDate())) {
            throw new IllegalArgumentException("Voting must start after registration ends");
        }

        if (dto.getVotingStartDate().isAfter(dto.getVotingEndDate())) {
            throw new IllegalArgumentException("Voting end must be after voting start");
        }

        String imageUrl;
        try {
            imageUrl = cloudinaryService.uploadImage(dto.getImage());
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }

        Seasons season = Seasons.builder()
                .name(name)
                .prizeMoney(dto.getPrizeMoney())
                .registrationStartDate(dto.getRegistrationStartDate())
                .registrationEndDate(dto.getRegistrationEndDate())
                .votingStartDate(dto.getVotingStartDate())
                .votingEndDate(dto.getVotingEndDate())
                .photoUrl(imageUrl)
                .build();

        seasonsRepository.save(season);

        return "Season created successfully";
    }



//upadate the season
   @Transactional
public String updateSeason(Long id, UpdateSeasonDTO dto) {

    Seasons season = seasonsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Season not found"));

    // Name
    if (dto.getName() != null) {

        String newName = dto.getName().trim();

        if (newName.isEmpty()) {
            throw new IllegalArgumentException("Season name cannot be empty");
        }

        if (seasonsRepository.existsByNameIgnoreCaseAndIdNot(newName, id)) {
            throw new IllegalArgumentException("Season name already exists");
        }

        season.setName(newName);
    }

    // Prize money
    if (dto.getPrizeMoney() != null) {

        if (dto.getPrizeMoney().signum() <= 0) {
            throw new IllegalArgumentException("Prize money must be positive");
        }

        season.setPrizeMoney(dto.getPrizeMoney());
    }


  
     //  2️⃣ LOCK FIELD UPDATES (TRUE/FALSE TOGGLE)
  

    if (dto.getVoteLock() != null) {
        season.setVoteLock(dto.getVoteLock());
    }

    if (dto.getParticipationLock() != null) {
        season.setParticipationLock(dto.getParticipationLock());
    }

    if (dto.getSeasonLock() != null) {
        season.setSeasonLock(dto.getSeasonLock());
    }


    //   3️⃣ TIMELINE PATCH SAFE LOGIC
   
    LocalDateTime regStart = dto.getRegistrationStartDate() != null
            ? dto.getRegistrationStartDate()
            : season.getRegistrationStartDate();

    LocalDateTime regEnd = dto.getRegistrationEndDate() != null
            ? dto.getRegistrationEndDate()
            : season.getRegistrationEndDate();

    LocalDateTime voteStart = dto.getVotingStartDate() != null
            ? dto.getVotingStartDate()
            : season.getVotingStartDate();

    LocalDateTime voteEnd = dto.getVotingEndDate() != null
            ? dto.getVotingEndDate()
            : season.getVotingEndDate();




    // Validate timeline consistency
    if (regStart.isAfter(regEnd)) {
        throw new IllegalArgumentException("Registration end must be after registration start");
    }

    if (regEnd.isAfter(voteStart)) {
        throw new IllegalArgumentException("Voting must start after registration ends");
    }

    if (voteStart.isAfter(voteEnd)) {
        throw new IllegalArgumentException("Voting end must be after voting start");
    }

    season.setRegistrationStartDate(regStart);
    season.setRegistrationEndDate(regEnd);
    season.setVotingStartDate(voteStart);
    season.setVotingEndDate(voteEnd);


     //  4️⃣ IMAGE UPDATE
 if (dto.getImage() != null && !dto.getImage().isEmpty()) {
try {
            String imageUrl = cloudinaryService.uploadImage(dto.getImage());
            season.setPhotoUrl(imageUrl);
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    return "Season updated successfully";
}




    //delete season
    public void deleteSeasonById(Long id) {

        Seasons season = seasonsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Season does not exist"));

        seasonsRepository.delete(season);
    }
}