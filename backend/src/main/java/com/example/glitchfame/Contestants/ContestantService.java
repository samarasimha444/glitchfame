package com.example.glitchfame.Contestants;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class ContestantService {

    private final ContestantRepository contestantRepository;

    public ContestantService(ContestantRepository contestantRepository) {
        this.contestantRepository = contestantRepository;
    }

    public List<ContestantsDTO> getAllApprovedContestants() {
        return contestantRepository.getAllApprovedContestants();
    }
}