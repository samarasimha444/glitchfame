package com.example.backend.seasons.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class SeasonForm {

    private String name; // season name

    private String description; // season description

    private String prize; // prize details

    private String photoUrl; // banner image

    private OffsetDateTime registrationStartDate; // admin sends offset time

    private OffsetDateTime registrationEndDate; // admin sends offset time

    private OffsetDateTime votingStartDate; // admin sends offset time

    private OffsetDateTime votingEndDate; // admin sends offset time
}