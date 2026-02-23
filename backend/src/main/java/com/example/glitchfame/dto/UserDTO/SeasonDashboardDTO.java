package com.example.glitchfame.dto.UserDTO;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class SeasonDashboardDTO {

    private Long id;
    private String name;
    private BigDecimal prizeMoney;

    private LocalDateTime registrationStartDate;
    private LocalDateTime registrationEndDate;
    private LocalDateTime votingStartDate;
    private LocalDateTime votingEndDate;

    private Long winnerId;

    // Calculated field (not stored in DB)
    private String status; // LIVE / UPCOMING / COMPLETED
}