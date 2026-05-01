package com.example.backend.participation.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class ParticipationForm {

    private UUID seasonId;
    private String name;
    private LocalDate dateOfBirth;
    private String location;
    private String description;
    private String photoUrl;
    private String mobileNumber;

}