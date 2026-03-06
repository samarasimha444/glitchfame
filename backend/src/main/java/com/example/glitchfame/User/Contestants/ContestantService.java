package com.example.glitchfame.User.Contestants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.User.Contestants.DTO.*;
import com.example.glitchfame.User.Seasons.Seasons;
import com.example.glitchfame.User.Seasons.SeasonsRepository;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContestantService {

    private final ContestantRepository contestantRepository;
    private final ExtractJwtData extractJwtData;
    private final AuthRepository authRepository;
    private final SeasonsRepository seasonsRepository;
    private final CloudinaryService cloudinaryService;

    private Pageable buildPageable(int page, int size) {
        if (size > 50) size = 50;
        return PageRequest.of(page, size);
    }

    private Long getUserId() {
        return extractJwtData.getUserId();
    }

    


    //get contestants
    public Page<ContestantsDTO> getContestants(int page, int size) {

        return contestantRepository.findApprovedLive(
                getUserId(),
                buildPageable(page, size)
        );
    }



    //get contestant by id
    public ContestantsDTO getById(Long id) {

        return contestantRepository
                .getContestantById(id, getUserId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Contestant not found"
                        ));
    }




// user applying for the season
public String apply(CreateContestantDTO request) {

    Long userId = getUserId();
    Long seasonId = request.getSeasonId();

    // ================= USER CHECK =================
    User user = authRepository.findById(userId)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "User not found"
                    ));

    if (!user.isCanParticipate()) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not allowed to participate"
        );
    }

    // ================= SEASON CHECK =================
    Seasons season = seasonsRepository.findById(seasonId)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Season not found"
                    ));

    if (season.isSeasonLock()) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Season is locked"
        );
    }

    if (season.isParticipationLock()) {
        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Participation is locked for this season"
        );
    }

    // ================= REGISTRATION WINDOW =================
    LocalDateTime now = LocalDateTime.now();

    if (season.getRegistrationStartDate() == null || season.getRegistrationEndDate() == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Registration dates are not configured"
        );
    }

    if (now.isBefore(season.getRegistrationStartDate())) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Registration has not started yet"
        );
    }

    if (now.isAfter(season.getRegistrationEndDate())) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Registration has ended"
        );
    }

    // ================= IMAGE VALIDATION =================
    if (request.getImage() == null || request.getImage().isEmpty()) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Image is required"
        );
    }

    // ================= IMAGE UPLOAD =================
    String imageUrl;
    try {
        imageUrl = cloudinaryService.uploadImage(request.getImage());
    } catch (Exception e) {
        throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Image upload failed"
        );
    }

    // ================= CHECK EXISTING PARTICIPATION =================
    Optional<Participation> existing =
            contestantRepository.findByUserIdAndSeasonId(userId, seasonId);

    if (existing.isPresent()) {

        Participation p = existing.get();

        if (p.getStatus() == Participation.Status.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Your application is already pending"
            );
        }

        if (p.getStatus() == Participation.Status.APPROVED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You are already approved for this season"
            );
        }

        // ================= REJECTED → RESUBMIT =================
        p.setName(request.getName());
        p.setDescription(request.getDescription());
        p.setDateOfBirth(request.getDateOfBirth());
        p.setLocation(request.getLocation());
        p.setPhotoUrl(imageUrl);
        p.setStatus(Participation.Status.PENDING);
       

        contestantRepository.save(p);

        return "Application resubmitted successfully. Status: PENDING";
    }

    // ================= CREATE NEW PARTICIPATION =================
    Participation participation = Participation.builder()
            .user(user)
            .season(season)
            .name(request.getName())
            .description(request.getDescription())
            .dateOfBirth(request.getDateOfBirth())
            .location(request.getLocation())
            .photoUrl(imageUrl)
            .status(Participation.Status.PENDING)
            .build();

    contestantRepository.save(participation);

    return "Application submitted successfully. Status: PENDING";
}




//search contestant by name
   public Page<ContestantByName> searchByName(
        String name,
        int page,
        int size) {

    if (name != null && name.trim().length() < 2) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Search must be at least 2 characters"
        );
    }

    return contestantRepository.searchByName(
            name == null ? null : name.trim(),
            PageRequest.of(page, size)
    );
}





//get contestants of a season(season id)
public Page<SeasonContestants> getApprovedSeasonContestants(
        Long seasonId,
        int page,
        int size) {

    if (seasonId == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Season id is required"
        );
    }

    return contestantRepository
            .findApprovedSeasonContestantsWithVotes(
                    seasonId,
                    extractJwtData.getUserId(),
                    PageRequest.of(page, size)
            );
}




//search for contestant of a season(season id)  by name
 public Page<SeasonContestants> searchSeasonContestantsByName(
        Long seasonId,
        String name,
        int page,
        int size) {
if (seasonId == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Season id is required"
        );
}

    if (name != null && name.trim().length() < 2) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Search must be at least 2 characters"
        );
    }

    return contestantRepository.searchSeasonContestantsByName(
            seasonId,
            name == null ? null : name.trim(),
            getUserId(),
            buildPageable(page, size)
    );
}






// ================= TRACK MY APPLICATIONS =================
public Page<MyApplicationsDTO> trackMyApplications(int page, int size) {

    return contestantRepository.findUserApplications(
            getUserId(),
            buildPageable(page, size)
    );
}





// ================= DELETE OWN PARTICIPATION =================
    public String deleteMyParticipation(Long id) {

        Long userId = getUserId();

        if (!contestantRepository.existsByIdAndUserId(id, userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can delete only your own participation"
            );
        }
        contestantRepository.deleteByIdAndUserId(id, userId);
        return "Participation deleted successfully";
    }
}