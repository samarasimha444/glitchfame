package com.example.glitchfame.dto.AdminDTO.AdminSeasonDTO;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeasonRequestDTO {

    private String name;

    private BigDecimal prizeMoney;

    private LocalDateTime registrationStartDate;

    private LocalDateTime registrationEndDate;

    private LocalDateTime votingStartDate;

    private LocalDateTime votingEndDate;
}