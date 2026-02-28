package com.example.glitchfame.Seasons;
import com.example.glitchfame.Seasons.DTO.SeasonDetailsDTO;
import com.example.glitchfame.Seasons.DTO.SeasonFormDTO;
import com.example.glitchfame.Seasons.DTO.SeasonsDTO;
import com.example.glitchfame.Seasons.DTO.UpdateSeasonDTO;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import com.example.glitchfame.Seasons.DTO.SeasonsByNameDTO;
import jakarta.transaction.Transactional;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;








@Service
@RequiredArgsConstructor
public class SeasonsService {
     



    // Inject repositories and utilities
    private final SeasonsRepository seasonsRepository;
    private final ExtractJwtData extractJwtData;
    private final CloudinaryService cloudinaryService;




    // upcoming seasons
    public List<SeasonsDTO> getUpcomingSeasons() {

        Long userId = extractJwtData.getUserId();
        return seasonsRepository.getUpcomingSeasons(userId);
    }




    // live seasons
    public List<SeasonsDTO> getLiveSeasons() {

        Long userId = extractJwtData.getUserId();
        return seasonsRepository.getLiveSeasons(userId);
    }



    // past seasons
    public List<SeasonsDTO> getPastSeasons() {

        Long userId = extractJwtData.getUserId();
        return seasonsRepository.getPastSeasons(userId);
    }

    
     //Season details
    public SeasonDetailsDTO getSeasonDetails(Long seasonId) {
        Long userId = extractJwtData.getUserId();
          SeasonDetailsDTO season =
                seasonsRepository.findSeasonDetailsById(seasonId, userId);
        if (season == null) {
            throw new RuntimeException("Season not found");
        }

        return season;
    }



//get season by name
        public List<SeasonsByNameDTO> searchSeasonsByName(String name) {
        String search = name == null ? "" : name.trim();
        // Prevent useless DB hits
    if (search.length() < 2) {
        return List.of();
    }
   return seasonsRepository.findSeasonsByNameContaining(search);
}




@Transactional
public String createSeason(SeasonFormDTO dto) {

    LocalDateTime now = LocalDateTime.now();
    if (seasonsRepository.existsByNameIgnoreCase(dto.getName().trim())) {
    throw new IllegalArgumentException("Season name already exists");}

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

    // 🔥 Upload image to Cloudinary
    String imageUrl;
    try {
        imageUrl = cloudinaryService.uploadImage(dto.getImage());
    } catch (Exception e) {
        throw new RuntimeException("Image upload failed");
    }

    Seasons season = Seasons.builder()
            .name(dto.getName())
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




@Transactional
public String updateSeason(Long id, UpdateSeasonDTO dto) {

    Seasons season = seasonsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Season not found"));

    LocalDateTime now = LocalDateTime.now();
    
    if (season.getVotingEndDate().isBefore(now)) {
        throw new IllegalStateException("Cannot modify a finished season");
    }

    // 🔹 Handle Name Update + Uniqueness Check
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

    // 🔹 Prize Money Update
    if (dto.getPrizeMoney() != null) {

        if (dto.getPrizeMoney().signum() <= 0) {
            throw new IllegalArgumentException("Prize money must be positive");
        }

        season.setPrizeMoney(dto.getPrizeMoney());
    }

    // 🔹 Prepare Timeline (PATCH Safe Logic)
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

    // 🔹 If registration start is being changed, prevent past date
    if (dto.getRegistrationStartDate() != null &&
            dto.getRegistrationStartDate().isBefore(now)) {
        throw new IllegalArgumentException("Registration start date cannot be in the past");
    }

    // 🔹 Timeline Validation
    if (regStart.isAfter(regEnd)) {
        throw new IllegalArgumentException("Registration end must be after registration start");
    }

    if (regEnd.isAfter(voteStart)) {
        throw new IllegalArgumentException("Voting must start after registration ends");
    }

    if (voteStart.isAfter(voteEnd)) {
        throw new IllegalArgumentException("Voting end must be after voting start");
    }

    // 🔹 Apply Validated Dates
    season.setRegistrationStartDate(regStart);
    season.setRegistrationEndDate(regEnd);
    season.setVotingStartDate(voteStart);
    season.setVotingEndDate(voteEnd);

    // 🔹 Photo Update (if provided)
   if (dto.getImage() != null && !dto.getImage().isEmpty()) {
    String imageUrl;
    try {
        imageUrl = cloudinaryService.uploadImage(dto.getImage());
    } catch (Exception e) {
        throw new RuntimeException("Image upload failed");
    }

    season.setPhotoUrl(imageUrl);
}


return "Season updated successfully";


}


 



//delete season by id
    public void deleteSeasonById(Long id) {
     Seasons season = seasonsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Season does not exist"));

    seasonsRepository.delete(season);
}



}