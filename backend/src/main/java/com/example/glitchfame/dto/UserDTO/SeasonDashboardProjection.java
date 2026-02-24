package com.example.glitchfame.dto.UserDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SeasonDashboardProjection {

    Long getId();               // season id (s.id)
    Long getParticipationId();  // participation id (p.id)

    String getName();
    BigDecimal getPrizeMoney();
    LocalDateTime getRegistrationStartDate();
    LocalDateTime getRegistrationEndDate();
    LocalDateTime getVotingStartDate();
    LocalDateTime getVotingEndDate();
    String getStatus();
}