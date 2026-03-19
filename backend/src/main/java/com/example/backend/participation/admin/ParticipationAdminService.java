package com.example.backend.participation.admin;

import com.example.backend.participation.Participation;
import com.example.backend.participation.admin.dto.ParticipantsByStatus;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParticipationAdminService {

    private final ParticipationAdminRepo participationAdminRepo;

    private final RedisTemplate<String, String> redis; // redis client


    // get participants from LIVE seasons filtered by status
    public Page<ParticipantsByStatus> getLiveParticipantsByStatus(
            String status,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size); // create pagination

        return participationAdminRepo.findLiveParticipantsByStatus(
                status,
                pageable
        ); // fetch participants from repo
    }





// admin updates participant status
public void updateParticipationStatus(UUID participationId, String status) {
Participation participation = participationAdminRepo.findById(participationId)
            .orElseThrow(() -> new IllegalStateException("Participation not found"));
if (!status.equals("APPROVED") && !status.equals("REJECTED") && !status.equals("PENDING")) {
        throw new IllegalArgumentException("Invalid status");
    }
participation.setStatus(status);
participationAdminRepo.save(participation);
}



    // search LIVE approved participants by name
    public Page<ParticipantsByStatus> searchLiveApprovedParticipants(
            String name,
            int page,
            int size
    ) {

        Pageable pageable = PageRequest.of(page, size); // pagination object
return participationAdminRepo.searchLiveApprovedParticipants(
                name,
                pageable
        ); // search participants
    }
}