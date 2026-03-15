package com.example.backend.participation.dto;

import java.util.UUID;

public class ParticipantsImpl implements Participants {

    private UUID participationId;
    private String participantName;
    private String participantPhotoUrl;
    private UUID seasonId;
    private Long totalVotes;
    private Boolean hasVoted;

    public ParticipantsImpl(
            UUID participationId,
            String participantName,
            String participantPhotoUrl,
            UUID seasonId,
            Long totalVotes,
            Boolean hasVoted
    ) {
        this.participationId = participationId;
        this.participantName = participantName;
        this.participantPhotoUrl = participantPhotoUrl;
        this.seasonId = seasonId;
        this.totalVotes = totalVotes;
        this.hasVoted = hasVoted;
    }

    @Override
    public UUID getParticipationId() { return participationId; }

    @Override
    public String getParticipantName() { return participantName; }

    @Override
    public String getParticipantPhotoUrl() { return participantPhotoUrl; }

    @Override
    public UUID getSeasonId() { return seasonId; }

    @Override
    public Long getTotalVotes() { return totalVotes; }

    @Override
    public Boolean getHasVoted() { return hasVoted; }
}