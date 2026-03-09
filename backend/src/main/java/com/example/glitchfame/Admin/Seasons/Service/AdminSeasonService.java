package com.example.glitchfame.Admin.Seasons.Service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import com.example.glitchfame.Admin.Contestants.AdminContestantRepository;
import com.example.glitchfame.Admin.Seasons.AdminSeasonRepository;
import com.example.glitchfame.Admin.Seasons.DTO.SeasonFormDTO;
import com.example.glitchfame.Admin.Seasons.DTO.UpdateSeasonDTO;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import com.example.glitchfame.User.Seasons.Seasons;
import com.example.glitchfame.User.Seasons.DTO.SeasonsDTO;
import com.example.glitchfame.Winner.WinnerRepository;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AdminSeasonService {

    private final AdminSeasonRepository repository;
    private final CloudinaryService cloudinaryService;
    private final AdminContestantRepository contestantRepository;
    private final WinnerRepository winnerRepository;

    private Pageable buildPageable(int page, int size) {
        if (size > 50) size = 50;
        return PageRequest.of(page, size);
    }

    private String normalizeStatus(String status) {
        if (status == null) return "ALL";
        String s = status.trim().toUpperCase();

        if (!s.equals("ALL") &&
            !s.equals("UPCOMING") &&
            !s.equals("LIVE") &&
            !s.equals("PAST")) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid status"
            );
        }

        return s;
    }

    // Get seasons by status
    public Page<SeasonsDTO> getSeasons(String status, int page, int size) {
        return repository.findByStatus(
                normalizeStatus(status),
                buildPageable(page, size)
        );
    }

    // Search seasons by name and status
    public Page<SeasonsDTO> search(String name, String status, int page, int size) {

        if (name == null || name.trim().length() < 2) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Search term must be at least 2 characters"
            );
        }

        return repository.searchByNameAndStatus(
                name.trim(),
                normalizeStatus(status),
                buildPageable(page, size)
        );
    }



//create season
@Transactional
public String createSeason(SeasonFormDTO dto) {
Instant now = Instant.now();

String name = dto.getName().trim();
String description = dto.getSeasonDesc().trim();

// Convert DTO times to UTC once
Instant registrationStart = dto.getRegistrationStartDate().toInstant();
Instant registrationEnd   = dto.getRegistrationEndDate().toInstant();
Instant votingStart       = dto.getVotingStartDate().toInstant();
Instant votingEnd         = dto.getVotingEndDate().toInstant();

// Check duplicate season name
if (repository.existsByNameIgnoreCase(name)) {
    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Season name already exists"
    );
}

// Validation checks
if (registrationStart.isBefore(now)) {
    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Registration start date cannot be in the past"
    );
}

if (registrationStart.isAfter(registrationEnd)) {
    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Registration end must be after or equal to registration start"
    );
}

if (votingStart.isBefore(registrationStart)) {
    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Voting start must be after or equal to registration start"
    );
}

if (votingStart.isAfter(votingEnd)) {
    throw new ResponseStatusException(
            HttpStatus.BAD_REQUEST,
            "Voting end must be after or equal to voting start"
    );
}

String imageUrl = cloudinaryService.uploadImage(dto.getImage());

Seasons season = Seasons.builder()
        .name(name)
        .seasonDesc(description)
        .prizeMoney(dto.getPrizeMoney())
        .registrationStartDate(registrationStart)
        .registrationEndDate(registrationEnd)
        .votingStartDate(votingStart)
        .votingEndDate(votingEnd)
        .photoUrl(imageUrl)
        .build();

repository.save(season);

return "Season created successfully";


}







// Update season
    @Transactional
    public String updateSeason(Long id, UpdateSeasonDTO dto) {

        Seasons season = repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Season not found"));

        if (dto.getName() != null) {
            String newName = dto.getName().trim();

            if (repository.existsByNameIgnoreCaseAndIdNot(newName, id)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Season name already exists"
                );
            }

            season.setName(newName);
        }

        if (dto.getPrizeMoney() != null)
            season.setPrizeMoney(dto.getPrizeMoney());

        if (dto.getVoteLock() != null)
            season.setVoteLock(dto.getVoteLock());

        if (dto.getParticipationLock() != null)
            season.setParticipationLock(dto.getParticipationLock());

        if (dto.getSeasonLock() != null)
            season.setSeasonLock(dto.getSeasonLock());

        if (dto.getImage() != null && !dto.getImage().isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(dto.getImage());
            season.setPhotoUrl(imageUrl);
        }

        return "Season updated successfully";
    }

  








    //season reset by admin
    @Transactional
    public void resetSeason(Long seasonId) {

        // delete contestants of that season
        contestantRepository.resetSeason(seasonId);

    }








// ================= END SEASON NOW =================
@Transactional
public String endSeasonNow(Long seasonId) {

    Seasons season = repository.findById(seasonId)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Season not found"));

    Instant now = Instant.now();

    // force lifecycle end
    season.setRegistrationStartDate(now);
    season.setRegistrationEndDate(now);
    season.setVotingStartDate(now);
    season.setVotingEndDate(now);

    repository.save(season);

    // calculate winner only once
    if (!winnerRepository.existsBySeasonId(seasonId)) {
        winnerRepository.insertSeasonWinner(seasonId);
    }

    return "Season ended and winner calculated";
}




    // Delete season
    @Transactional
    public String deleteSeasonById(Long id) {

        Seasons season = repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Season not found"));

        repository.delete(season);

        return "Season deleted successfully";
    }
}