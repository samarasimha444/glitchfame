package com.example.backend.participation.admin.dto;

import java.util.UUID;

public class ParticipantsByStatusImpl implements ParticipantsByStatus {

    private final UUID participationId;
    private final String participantName;
    private final String participantPhotoUrl;
    private final String seasonName;
    private final UUID seasonId;
    private final String status;
    private final Long totalVotes;

    public ParticipantsByStatusImpl(
            UUID participationId,
            String participantName,
            String participantPhotoUrl,
            String seasonName,
            UUID seasonId,
            String status,
            Long totalVotes
    ) {
        this.participationId = participationId;
        this.participantName = participantName;
        this.participantPhotoUrl = participantPhotoUrl;
        this.seasonName = seasonName;
        this.seasonId = seasonId;
        this.status = status;
        this.totalVotes = totalVotes;
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
    public Long getTotalVotes() {
        return totalVotes;
    }
}