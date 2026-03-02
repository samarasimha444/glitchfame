package com.example.glitchfame.Contestants;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;

import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Seasons.Seasons;
import com.example.glitchfame.Seasons.SeasonsRepository;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.Contestants.DTO.CreateContestantDTO;

@Service
@RequiredArgsConstructor
public class ContestantService {

    private final ContestantRepository contestantRepository;
    private final ExtractJwtData extractJwtData;
    private final AuthRepository authRepository;
    private final SeasonsRepository seasonsRepository;
    private final CloudinaryService cloudinaryService;

    // ==========================================================
    // Utility Methods
    // ==========================================================

    private String normalizeStatus(String status) {

        if (status == null) {
            return "ALL";
        }

        String normalized = status.trim().toUpperCase();

        if (!normalized.equals("ALL") &&
            !normalized.equals("APPROVED") &&
            !normalized.equals("PENDING") &&
            !normalized.equals("REJECTED")) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid status"
            );
        }

        return normalized;
    }

    private Pageable buildPageable(int page, int size) {
        if (size > 50) size = 50;
        return PageRequest.of(page, size);
    }

    private Long getUserId() {
        return extractJwtData.getUserId();
    }

    // ==========================================================
    // UNIVERSAL FILTER METHOD
    // Handles:
    // - status
    // - seasonId
    // - name search
    // - live filter
    // ==========================================================

    public Page<ContestantsDTO> getContestants(
            Long seasonId,
            String name,
            String status,
            Boolean liveOnly,
            int page,
            int size) {

        String normalizedStatus = normalizeStatus(status);

        if (seasonId != null && !seasonsRepository.existsById(seasonId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Season not found"
            );
        }

        if (name != null && name.trim().length() < 2) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Search term must be at least 2 characters"
            );
        }

        return contestantRepository.findWithFilters(
                seasonId,
                name == null ? null : name.trim(),
                normalizedStatus,
                liveOnly != null && liveOnly,
                getUserId(),
                buildPageable(page, size)
        );
    }

    // ==========================================================
    // GET BY ID
    // ==========================================================

    public ContestantsDTO getById(Long id) {

        return contestantRepository
                .getContestantById(id, getUserId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Contestant not found"
                        )
                );
    }

    // ==========================================================
    // CREATE PARTICIPATION
    // ==========================================================

    public String createContestant(CreateContestantDTO request) {

        Long userId = getUserId();
        Long seasonId = request.getSeasonId();

        User user = authRepository.findById(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        if (!user.isCanParticipate()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You are not allowed to participate"
            );
        }

        if (contestantRepository.existsByUserIdAndSeasonId(userId, seasonId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Already applied for this season"
            );
        }

        if (!seasonsRepository.existsById(seasonId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Season not found"
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

    // ==========================================================
    // UPDATE STATUS (APPROVE / REJECT)
    // ==========================================================

    @Transactional
    public String updateStatus(Long id, String action) {

        Participation participation = contestantRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Participation not found"
                        )
                );

        if (participation.getStatus() != Participation.Status.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only PENDING participation can be modified"
            );
        }

        Participation.Status newStatus;

        if ("APPROVE".equalsIgnoreCase(action)) {
            newStatus = Participation.Status.APPROVED;
        } 
        else if ("REJECT".equalsIgnoreCase(action)) {
            newStatus = Participation.Status.REJECTED;
        } 
        else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid action. Use APPROVE or REJECT"
            );
        }

        participation.setStatus(newStatus);

        return "Participation " + newStatus.name() + " successfully";
    }

    // ==========================================================
    // DELETE
    // ==========================================================

    public String delete(Long id) {

        if (!contestantRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Participation does not exist"
            );
        }

        contestantRepository.deleteById(id);

        return "Participation deleted successfully";
    }
}