package com.example.glitchfame.Contestants;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import com.example.glitchfame.Auth.User;
import com.example.glitchfame.Seasons.Seasons;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.Contestants.DTO.ContestantsStatusDTO;
import com.example.glitchfame.Contestants.DTO.CreateContestantDTO;
import com.example.glitchfame.Contestants.DTO.SeasonContestants;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.Auth.AuthRepository;
import com.example.glitchfame.Seasons.SeasonsRepository;


@Service
@RequiredArgsConstructor
public class ContestantService {

    private final ContestantRepository contestantRepository;
    private final ExtractJwtData extractJwtData;
    private final AuthRepository authRepository;
    private final SeasonsRepository seasonsRepository;




// Approved contestants
  public List<ContestantsDTO> getAllApprovedContestants() {
    Long userId = extractJwtData.getUserId();
    return contestantRepository.getAllApprovedContestants(userId);
}



    // Pending contestants
    public List<ContestantsStatusDTO> getAllPendingContestants() {
        List<ContestantsStatusDTO> list =
                contestantRepository.getAllPendingContestants();

        if (list.isEmpty()) {
            throw new RuntimeException("No pending contestants found");
        }

        return list;
    }



    // Rejected contestants
    public List<ContestantsStatusDTO> getAllRejectedContestants() {
        List<ContestantsStatusDTO> list =
                contestantRepository.getAllRejectedContestants();

        if (list.isEmpty()) {
            throw new RuntimeException("No rejected contestants found");
        }

        return list;
    }

    

    // ✅ Create contestant (User apply for season)
      public String createContestant(CreateContestantDTO request) {
        Long userId = extractJwtData.getUserId();
        Long seasonId = request.getSeasonId();
        if (contestantRepository.existsByUserIdAndSeasonId(userId, seasonId)) {
            throw new RuntimeException("You have already applied for this season.");
        }

        User user = authRepository.getReferenceById(userId);
        Seasons season = seasonsRepository.getReferenceById(seasonId);

        Participation participation = Participation.builder()
                .user(user)
                .season(season)
                .name(request.getName())
                .description(request.getDescription())
                .dateOfBirth(request.getDateOfBirth())
                .location(request.getLocation())
                .photoUrl(request.getPhotoUrl())
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


//delete participation by id
    public String deleteParticipationById(Long id) {
        if (!contestantRepository.existsById(id)) {
            throw new RuntimeException("Participation  does not exist.");
        }
        contestantRepository.deleteById(id);
        return "Participation deleted successfully.";
    }


}
