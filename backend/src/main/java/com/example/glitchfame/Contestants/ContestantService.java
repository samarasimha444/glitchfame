package com.example.glitchfame.Contestants;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Seasons.Seasons;
import com.example.glitchfame.Contestants.DTO.ContestantByName;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.Contestants.DTO.CreateContestantDTO;
import com.example.glitchfame.Contestants.DTO.SeasonContestants;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Seasons.SeasonsRepository;
import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


@Service
@RequiredArgsConstructor
public class ContestantService {

    private final ContestantRepository contestantRepository;
    private final ExtractJwtData extractJwtData;
    private final AuthRepository authRepository;
    private final SeasonsRepository seasonsRepository;
    private final CloudinaryService cloudinaryService;





//get contestants by status
public Page<ContestantsDTO> getContestantsByStatus(
        String status,
        int page,
        int size) {
    if (status == null) {
        throw new IllegalArgumentException("Status is required");
    }
    String normalizedStatus = status.trim().toUpperCase();
     if (!normalizedStatus.equals("PENDING") &&
        !normalizedStatus.equals("REJECTED") &&
        !normalizedStatus.equals("APPROVED")) {

        throw new IllegalArgumentException("Invalid status");}
     if (size > 50) {
        size = 50;
    }
    Long userId = extractJwtData.getUserId();
    Pageable pageable = PageRequest.of(page, size);
     return contestantRepository
            .getContestantsByStatus(normalizedStatus, userId, pageable);}





// Create contestant (User apply for season)
public String createContestant(CreateContestantDTO request) {

    Long userId = extractJwtData.getUserId();
    Long seasonId = request.getSeasonId();

    // 🔒 Fetch user from DB
    User user = authRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 🚫 Check participation permission
    if (!user.isCanParticipate()) {
        throw new RuntimeException("You are not allowed to participate.");
    }

    // 🚫 Prevent duplicate application
    if (contestantRepository.existsByUserIdAndSeasonId(userId, seasonId)) {
        throw new RuntimeException("You have already applied for this season.");
    }

    // 🔥 Upload image
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


 //get all contestants of a season
    public List<SeasonContestants> getSeasonContestants(Long seasonId) {
        if (!seasonsRepository.existsById(seasonId)) {
            throw new RuntimeException("Season not found");
        }
        Long userId = extractJwtData.getUserId();
        return contestantRepository
                .findSeasonContestants(seasonId, userId);
    }



    //search by name
    public List<ContestantByName> searchContestantsByName(String name) {

    String search = name == null ? "" : name.trim();

    if (search.length() < 2) {
        return List.of();   // no DB hit, clean response
    }

    return contestantRepository.findByNameContaining(search);
}








//get contestant by id
public ContestantsDTO getApprovedContestantById(Long id) {

    Long userId = extractJwtData.getUserId();

    return contestantRepository
            .getApprovedContestantById(id, userId)
            .orElseThrow(() ->
                    new RuntimeException("Approved contestant not found"));
}






// Approve participation
@Transactional
public String approveParticipation(Long participationId) {

    Participation participation = contestantRepository.findById(participationId)
            .orElseThrow(() -> new RuntimeException("Participation not found"));

    if (participation.getStatus() != Participation.Status.PENDING) {
        throw new IllegalStateException("Only PENDING participation can be approved");
    }

    participation.setStatus(Participation.Status.APPROVED);

    return "Participation approved successfully.";
}




// Reject participation
    @Transactional
    public String rejectParticipation(Long participationId) {
    Participation participation = contestantRepository.findById(participationId)
            .orElseThrow(() -> new RuntimeException("Participation not found"));
    if (participation.getStatus() != Participation.Status.PENDING) {
        throw new IllegalStateException("Only PENDING participation can be rejected");
    }
    participation.setStatus(Participation.Status.REJECTED);
    return "Participation rejected successfully.";
}














//delete participation by id
    public String deleteParticipationById(Long id) {
        if (!contestantRepository.existsById(id)) {
            throw new RuntimeException("Participation  does not exist.");
        }
        contestantRepository.deleteById(id);
        return "Participation deleted successfully.";
    }

}
