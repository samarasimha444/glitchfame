package com.example.glitchfame.Contestants;
import org.springframework.stereotype.Service;
import com.example.glitchfame.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.Contestants.DTO.ContestantsStatusDTO;
import java.util.List;




@Service
public class ContestantService {

    private final ContestantRepository contestantRepository;


     // Constructor injection for the repository
    public ContestantService(ContestantRepository contestantRepository) {
        this.contestantRepository = contestantRepository;
    }



    // Approved contestants
    public List<ContestantsDTO> getAllApprovedContestants() {
                List<ContestantsDTO> list =
                contestantRepository.getAllApprovedContestants();
                if (list == null || list.isEmpty()) {
            throw new RuntimeException("No approved contestants found");
        }

        return list;
    }




    



    // Pending contestants
    public List<ContestantsStatusDTO> getAllPendingContestants() {
                List<ContestantsStatusDTO> list =
                contestantRepository.getAllPendingContestants();
                if (list == null || list.isEmpty()) {
            throw new RuntimeException("No pending contestants found");
        }

        return list;
    }







    // Rejected contestants
    public List<ContestantsStatusDTO> getAllRejectedContestants() {
                List<ContestantsStatusDTO> list =
                contestantRepository.getAllRejectedContestants();

        if (list == null || list.isEmpty()) {
            throw new RuntimeException("No rejected contestants found");
        }

        return list;
    }
}