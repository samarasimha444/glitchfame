package com.example.glitchfame.Admin.Seasons.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

@Data
public class UpdateSeasonDTO {

    private String name;
    private BigDecimal prizeMoney;
    private LocalDateTime registrationStartDate;
    private LocalDateTime registrationEndDate;
    private LocalDateTime votingStartDate;
    private LocalDateTime votingEndDate;
    private MultipartFile Image;


    private Boolean voteLock;
private Boolean participationLock;
private Boolean seasonLock;
}