package com.example.backend.participation.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestantDTO {

    private UUID participationId;
    private String name;
    private String photoUrl;

    private Long votes;
    private Boolean hasVoted;
}