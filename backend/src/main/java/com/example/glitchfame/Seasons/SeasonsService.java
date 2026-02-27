package com.example.glitchfame.Seasons;
import com.example.glitchfame.Seasons.DTO.SeasonDetailsDTO;
import com.example.glitchfame.Seasons.DTO.SeasonsDTO;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.glitchfame.Seasons.DTO.SeasonsByNameDTO;

@Service
@RequiredArgsConstructor
public class SeasonsService {

    private final SeasonsRepository seasonsRepository;
    private final ExtractJwtData extractJwtData;

    // upcoming seasons
    public List<SeasonsDTO> getUpcomingSeasons() {

        Long userId = extractJwtData.getUserId();
        return seasonsRepository.getUpcomingSeasons(userId);
    }

    // live seasons
    public List<SeasonsDTO> getLiveSeasons() {

        Long userId = extractJwtData.getUserId();
        return seasonsRepository.getLiveSeasons(userId);
    }

    // past seasons
    public List<SeasonsDTO> getPastSeasons() {

        Long userId = extractJwtData.getUserId();
        return seasonsRepository.getPastSeasons(userId);
    }

    



    //Season details
    public SeasonDetailsDTO getSeasonDetails(Long seasonId) {
        Long userId = extractJwtData.getUserId();
          SeasonDetailsDTO season =
                seasonsRepository.findSeasonDetailsById(seasonId, userId);
        if (season == null) {
            throw new RuntimeException("Season not found");
        }

        return season;
    }




//get season by name
        public List<SeasonsByNameDTO> searchSeasonsByName(String name) {
        String search = name == null ? "" : name.trim();
        // Prevent useless DB hits
    if (search.length() < 2) {
        return List.of();
    }
   return seasonsRepository.findSeasonsByNameContaining(search);
}










    

    //delete season by id
    public void deleteSeasonById(Long id) {
     Seasons season = seasonsRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Season does not exist"));

    seasonsRepository.delete(season);
}
}