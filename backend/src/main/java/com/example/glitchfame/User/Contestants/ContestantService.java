package com.example.glitchfame.User.Contestants;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.User.Contestants.DTO.*;
import com.example.glitchfame.User.Seasons.Seasons;
import com.example.glitchfame.User.Seasons.SeasonsRepository;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;

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

    

    //apply for season
    public String apply(CreateContestantDTO request) {

        Long userId = getUserId();
        Long seasonId = request.getSeasonId();

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

        if (!seasonsRepository.existsById(seasonId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Season not found"
            );
        }

        if (contestantRepository.existsByUserIdAndSeasonId(userId, seasonId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Already applied for this season"
            );
        }

        String imageUrl = cloudinaryService.uploadImage(request.getImage());
        Seasons season = seasonsRepository.getReferenceById(seasonId);

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