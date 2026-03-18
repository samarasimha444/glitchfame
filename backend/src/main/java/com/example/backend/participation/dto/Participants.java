package com.example.backend.participation.dto;

import java.util.UUID;

public interface Participants {

    UUID getParticipationId();   // participation_id
 String getParticipantName(); // name
 String getParticipantPhotoUrl(); // photo_url
UUID getSeasonId(); // season_id
Long getTotalVotes(); // total_votes
Boolean getHasVoted(); // calculated from votes table

    
}
