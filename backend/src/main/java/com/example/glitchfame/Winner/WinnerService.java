package com.example.glitchfame.Winner;
import com.example.glitchfame.User.Seasons.Seasons;
import com.example.glitchfame.Admin.Seasons.AdminSeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WinnerService {

    private final AdminSeasonRepository seasonRepository;
    private final WinnerRepository winnerRepository;

    // ================= FINALIZE SEASONS (SCHEDULER) =================
    @Transactional
    public void finalizeSeasons() {

        List<Seasons> seasons = seasonRepository.findSeasonsToFinalize();

        for (Seasons season : seasons) {

            Long seasonId = season.getId();

            // insert winner only if not already inserted
            if (!winnerRepository.existsBySeasonId(seasonId)) {
                winnerRepository.insertSeasonWinner(seasonId);
            }

            // lock season so scheduler won't process again
            season.setSeasonLock(true);

            seasonRepository.save(season);
        }
    }

    // ================= GET ALL WINNERS =================
    public List<WinnerDTO> getAllSeasonWinners() {

        return winnerRepository.findAllSeasonWinners()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ================= GET WINNER OF ONE SEASON =================
    public List<WinnerDTO> getSeasonWinner(Long seasonId) {

        return winnerRepository.findWinnersBySeason(seasonId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ================= ENTITY → DTO =================
    private WinnerDTO convertToDTO(SeasonWinner winner) {

        return WinnerDTO.builder()
                .seasonId(winner.getSeasonId())
                .seasonName(winner.getSeasonName())
                .contestantId(winner.getContestantId())
                .contestantName(winner.getContestantName())
                .photoUrl(winner.getPhotoUrl())
                .prizeMoney(winner.getPrizeMoney())
                .totalVotes(winner.getTotalVotes())
                .build();
    }
}