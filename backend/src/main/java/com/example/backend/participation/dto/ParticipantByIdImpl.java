package com.example.backend.participation.dto;
import java.util.UUID;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.LocalDateTime;


public class ParticipantByIdImpl implements ParticipantById {

    private UUID participationId;
    private String participantName;
    private String participantPhotoUrl;

    private LocalDate dateOfBirth;
    private String location;
    private String description;

    private String status;

    private UUID seasonId;
    private String seasonName;
    private BigDecimal prizeMoney;

    private Long voteCount;
    private Boolean hasVoted;

    private String seasonPhotoUrl;

    private LocalDateTime registrationStartDate;
    private LocalDateTime registrationEndDate;
    private LocalDateTime votingStartDate;
    private LocalDateTime votingEndDate;

    public ParticipantByIdImpl(
            UUID participationId,
            String participantName,
            String participantPhotoUrl,
            LocalDate dateOfBirth,
            String location,
            String description,
            String status,
            UUID seasonId,
            String seasonName,
            BigDecimal prizeMoney,
            Long voteCount,
            Boolean hasVoted,
            String seasonPhotoUrl,
            LocalDateTime registrationStartDate,
            LocalDateTime registrationEndDate,
            LocalDateTime votingStartDate,
            LocalDateTime votingEndDate
    ) {
        this.participationId = participationId;
        this.participantName = participantName;
        this.participantPhotoUrl = participantPhotoUrl;
        this.dateOfBirth = dateOfBirth;
        this.location = location;
        this.description = description;
        this.status = status;
        this.seasonId = seasonId;
        this.seasonName = seasonName;
        this.prizeMoney = prizeMoney;
        this.voteCount = voteCount;
        this.hasVoted = hasVoted;
        this.seasonPhotoUrl = seasonPhotoUrl;
        this.registrationStartDate = registrationStartDate;
        this.registrationEndDate = registrationEndDate;
        this.votingStartDate = votingStartDate;
        this.votingEndDate = votingEndDate;
    }

    public UUID getParticipationId() { return participationId; }
    public String getParticipantName() { return participantName; }
    public String getParticipantPhotoUrl() { return participantPhotoUrl; }
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public UUID getSeasonId() { return seasonId; }
    public String getSeasonName() { return seasonName; }
    public BigDecimal getPrizeMoney() { return prizeMoney; }
    public Long getVoteCount() { return voteCount; }
    public Boolean getHasVoted() { return hasVoted; }
    public String getSeasonPhotoUrl() { return seasonPhotoUrl; }
    public LocalDateTime getRegistrationStartDate() { return registrationStartDate; }
    public LocalDateTime getRegistrationEndDate() { return registrationEndDate; }
    public LocalDateTime getVotingStartDate() { return votingStartDate; }
    public LocalDateTime getVotingEndDate() { return votingEndDate; }
}