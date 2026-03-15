package com.example.backend.seasons;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;



@Entity
@Table(name = "season")
@Getter
@Setter
public class Season {

    @Id
    @GeneratedValue
    @Column(name = "season_id", nullable = false)
    private UUID seasonId; // primary key

    @Column(nullable = false, length = 150 ,unique =true)
    private String name; // season name

    @Column(length = 500)
    private String description; // season description

    @Column(length = 200)
    private String prize; // prize details

    @Column(name = "photo_url")
    private String photoUrl; // banner image url

    @Column(name = "registration_start_date")
    private Instant registrationStartDate; // registration start time (UTC)

    @Column(name = "registration_end_date")
    private Instant registrationEndDate; // registration end time (UTC)

    @Column(name = "voting_start_date")
    private Instant votingStartDate; // voting start time (UTC)

    @Column(name = "voting_end_date")
    private Instant votingEndDate; // voting end time (UTC)


   @Column(name = "season_lock", nullable = false)
private boolean locked = false;
}