package com.example.glitchfame.Admin.Seasons.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import org.springframework.web.multipart.MultipartFile;

@Data
public class SeasonFormDTO {

    @NotBlank(message = "Season name is required")
    private String name;

    @NotNull(message = "Prize money is required")
    @Positive(message = "Prize money must be positive")
    private BigDecimal prizeMoney;

    @NotNull(message = "Registration start date is required")
    private OffsetDateTime registrationStartDate;

    @NotNull(message = "Registration end date is required")
    private OffsetDateTime registrationEndDate;

    @NotNull(message = "Voting start date is required")
    private OffsetDateTime votingStartDate;

    @NotNull(message = "Voting end date is required")
    private OffsetDateTime votingEndDate;

    @NotBlank(message = "Season description is required")
    private String seasonDesc;

    @NotNull(message = "Image is required")
    private MultipartFile image;
}