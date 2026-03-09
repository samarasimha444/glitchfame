package com.example.glitchfame.Admin.Seasons.Service;

import com.example.glitchfame.User.Seasons.Seasons;
import com.example.glitchfame.Admin.Seasons.AdminSeasonRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class SeasonUpdateService {


private final AdminSeasonRepository repository;

// fetch season or throw error
private Seasons getSeason(Long id) {
    return repository.findById(id)
            .orElseThrow(() ->
                    new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Season not found"));
}

// update prize money
@Transactional
public String updatePrizeMoney(Long id, BigDecimal prizeMoney) {

    Seasons season = getSeason(id);

    if (prizeMoney == null || prizeMoney.compareTo(BigDecimal.ZERO) <= 0) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Prize money must be greater than zero");
    }

    season.setPrizeMoney(prizeMoney);

    return "Prize money updated";
}

// update registration dates
@Transactional
public String updateRegistrationDates(
        Long id,
        Instant start,
        Instant end) {

    Seasons season = getSeason(id);

    if (start != null) {
        season.setRegistrationStartDate(start);
    }

    if (end != null) {
        season.setRegistrationEndDate(end);
    }

    if (start != null && end != null && end.isBefore(start)) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Registration end date must be after start date");
    }

    return "Registration dates updated";
}

// update voting dates
@Transactional
public String updateVotingDates(
        Long id,
        Instant start,
        Instant end) {

    Seasons season = getSeason(id);

    if (start != null) {
        season.setVotingStartDate(start);
    }

    if (end != null) {
        season.setVotingEndDate(end);
    }

    if (start != null && end != null && end.isBefore(start)) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Voting end date must be after start date");
    }

    return "Voting dates updated";
}

// toggle vote lock
@Transactional
public String toggleVoteLock(Long id) {

    Seasons season = getSeason(id);

    season.setVoteLock(!season.isVoteLock());

    return season.isVoteLock()
            ? "Voting locked"
            : "Voting unlocked";
}

// toggle participation lock
@Transactional
public String toggleParticipationLock(Long id) {

    Seasons season = getSeason(id);

    season.setParticipationLock(!season.isParticipationLock());

    return season.isParticipationLock()
            ? "Participation locked"
            : "Participation unlocked";
}

// toggle season lock
@Transactional
public String toggleSeasonLock(Long id) {

    Seasons season = getSeason(id);

    season.setSeasonLock(!season.isSeasonLock());

    return season.isSeasonLock()
            ? "Season locked"
            : "Season unlocked";
}


}
