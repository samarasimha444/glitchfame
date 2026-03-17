package com.example.backend.seasons.dto;

import com.example.backend.participation.dto.Participants;
import org.springframework.data.domain.Page;

public class SeasonFullResponse {

    private SeasonDetails season;        // existing projection
    private Page<Participants> participants; // paginated participants

    // getters
    public SeasonDetails getSeason() {
        return season;
    }

    public Page<Participants> getParticipants() {
        return participants;
    }

    // setters
    public void setSeason(SeasonDetails season) {
        this.season = season;
    }

    public void setParticipants(Page<Participants> participants) {
        this.participants = participants;
    }
}