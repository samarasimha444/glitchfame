package com.example.glitchfame.Seasons;
import com.example.glitchfame.Seasons.DTO.SeasonsDTO;
import com.example.glitchfame.Configuration.jwt.ExtractJwtData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

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
}