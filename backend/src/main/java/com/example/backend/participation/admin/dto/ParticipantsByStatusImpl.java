package com.example.backend.participation.admin.dto;

import java.util.UUID;

public class ParticipantsByStatusImpl implements ParticipantsByStatus {

    private final UUID participationId;
    private final String participantName;
    private final String participantPhotoUrl;
    private final String seasonName;
    private final UUID seasonId;
    private final String status;

    private final Long score;
    private final Long rank;
    private final Boolean hasVoted;
    private final Boolean hasKilled;

    public ParticipantsByStatusImpl(
            UUID participationId,
            String participantName,
            String participantPhotoUrl,
            String seasonName,
            UUID seasonId,
            String status,
            Long score,
            Long rank,
            Boolean hasVoted,
            Boolean hasKilled
    ) {
        this.participationId = participationId;
        this.participantName = participantName;
        this.participantPhotoUrl = participantPhotoUrl;
        this.seasonName = seasonName;
        this.seasonId = seasonId;
        this.status = status;
        this.score = score;
        this.rank = rank;
        this.hasVoted = hasVoted;
        this.hasKilled = hasKilled;
    }

    @Override
    public UUID getParticipationId() {
        return participationId;
    }

    @Override
    public String getParticipantName() {
        return participantName;
    }

    @Override
    public String getParticipantPhotoUrl() {
        return participantPhotoUrl;
    }

    @Override
    public String getSeasonName() {
        return seasonName;
    }

    @Override
    public UUID getSeasonId() {
        return seasonId;
    }

    @Override
    public String getStatus() {
        return status;
    }

    @Override
    public Long getScore() {
        return score;
    }

    @Override
    public Long getRank() {
        return rank;
    }

    @Override
    public Boolean getHasVoted() {
        return hasVoted;
    }

    @Override
    public Boolean getHasKilled() {
        return hasKilled;
    }
}