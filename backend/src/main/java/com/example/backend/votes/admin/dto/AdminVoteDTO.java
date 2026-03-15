package com.example.backend.votes.admin.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AdminVoteDTO {

    private UUID participationId;

    /* number of votes to add or remove */
    private long voteDelta;
}