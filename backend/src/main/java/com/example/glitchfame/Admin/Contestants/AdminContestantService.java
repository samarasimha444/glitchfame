package com.example.glitchfame.Admin.Contestants;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;

import com.example.glitchfame.Admin.Votes.AdminVotes;
import com.example.glitchfame.Admin.Votes.AdminVotesRepository;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import com.example.glitchfame.User.Contestants.Participation;
import com.example.glitchfame.User.Contestants.DTO.ContestantByName;
import com.example.glitchfame.User.Contestants.DTO.ContestantsDTO;
import com.example.glitchfame.User.Contestants.DTO.SeasonContestants;
import com.example.glitchfame.User.Seasons.SeasonsRepository;

@Service
@RequiredArgsConstructor
public class AdminContestantService {

    private final AdminContestantRepository repository;
    private final SeasonsRepository seasonsRepository;
    private final ExtractJwtData extractJwtData;
    private final AdminVotesRepository adminVotesRepository;

    public Page<ContestantsDTO> getLiveContestants(String status, int page, int size) {
        if (size > 50) size = 50;
        return repository.findLiveSeasonContestantsByStatus(
                status,
                PageRequest.of(page, size)
        );
    }


//contestants search by name filter by season id,season status and participant status
    public Page<ContestantByName> search(
            Long seasonId,
            String seasonType,
            String status,
            String name,
            int page,
            int size) {

            if (seasonId != null && !seasonsRepository.existsById(seasonId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Season not found"
            );
        }

        if (size > 50) size = 50;

        return repository.searchContestants(
                seasonId,
                seasonType,
                status,
                name,
                PageRequest.of(page, size)
        );
    }




  //get season contestants filter by participants status
   public Page<SeasonContestants> getSeasonContestants(
            Long seasonId,
            String status,
            int page,
            int size) {

        if (!seasonsRepository.existsById(seasonId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Season not found"
            );
        }

        if (size > 50) size = 50;

        return repository.findSeasonContestantsByStatus(
                seasonId,
                status,
                extractJwtData.getUserId(),
                PageRequest.of(page, size)
        );
    }





//upadate status(approved or reject)
   @Transactional
public String updateStatus(Long id, String action) {

    Participation participation = repository.findById(id)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Participation not found"
                    ));

    if (participation.getStatus() != Participation.Status.PENDING) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Only PENDING participation can be modified"
        );
    }

    if ("APPROVE".equalsIgnoreCase(action)) {

        participation.setStatus(Participation.Status.APPROVED);

        if (!adminVotesRepository.existsByParticipationId(id)) {
            AdminVotes adminVotes = AdminVotes.builder()
                    .participationId(id)
                    .adminVoteCount(0)
                    .build();

            adminVotesRepository.save(adminVotes);
        }

    } else if ("REJECT".equalsIgnoreCase(action)) {

        participation.setStatus(Participation.Status.REJECTED);

        adminVotesRepository.deleteByParticipationId(id);

    } else {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid action"
        );
    }

    return "Status updated successfully";
}





//delete participations
    @Transactional
    public String delete(Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Participation not found"
            );
        }

        repository.deleteById(id);

        return "Participation deleted successfully";
    }




    //search for live and approved contestants by name
    
public Page<SearchByNameDTO> searchLiveApprovedContestants(
        String name,
        int page,
        int size) {

    // limit page size to avoid heavy queries
    if (size > 50) size = 50;

    return repository.searchLiveApprovedContestants(
            name,
            PageRequest.of(page, size)
    );
}
}