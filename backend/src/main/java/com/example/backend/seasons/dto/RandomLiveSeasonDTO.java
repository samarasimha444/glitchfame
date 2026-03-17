package com.example.backend.seasons.dto;

import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import com.example.backend.participation.dto.ContestantDTO;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RandomLiveSeasonDTO {

    private UUID seasonId;
    private String seasonName;
    private String seasonPhotoUrl;
    private Instant votingStartDate;
    private Instant votingEndDate;
 private List<ContestantDTO> contestants;
}
