package com.example.glitchfame.Service.UserService;

import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Repository.UserRepository.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSeasonService {

    private final SeasonRepository seasonRepository;

    public List<Seasons> getAllSeasons() {
        return seasonRepository.findByDeletedFalse();
    }
}