package com.example.glitchfame.Admin.Seasons.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateSeasonDTO {

    private String name;

    private BigDecimal prizeMoney;

    private OffsetDateTime registrationStartDate;

    private OffsetDateTime registrationEndDate;

    private OffsetDateTime votingStartDate;

    private OffsetDateTime votingEndDate;

    private MultipartFile image;

    private Boolean voteLock;

    private Boolean participationLock;

    private Boolean seasonLock;
}