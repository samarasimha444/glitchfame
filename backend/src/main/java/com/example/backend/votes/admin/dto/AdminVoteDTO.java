package com.example.backend.votes.admin.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AdminVoteDTO {

    private UUID participationId;
    private UUID seasonId;
    private long scoreDelta;
}