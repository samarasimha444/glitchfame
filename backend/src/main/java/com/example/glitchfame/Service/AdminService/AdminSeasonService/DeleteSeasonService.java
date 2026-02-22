package com.example.glitchfame.Service.AdminService.AdminSeasonService;

import com.example.glitchfame.Entity.Seasons;
import com.example.glitchfame.Repository.AdminRepository.AdminSeasonRepository.DeleteSeasonRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DeleteSeasonService {

    private final DeleteSeasonRepository deleteSeasonRepository;

    public void softDeleteSeason(Long id) {

        Seasons season = deleteSeasonRepository
                .findByIdAndDeletedFalse(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Season not found"));

        season.setDeleted(true);

        deleteSeasonRepository.save(season);
    }
}