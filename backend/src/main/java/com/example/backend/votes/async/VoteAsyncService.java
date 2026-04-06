package com.example.backend.votes.async;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import com.example.backend.votes.async.dto.Broadcast;
import com.example.backend.votes.user.VoteRepo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.UUID;




@Service
@RequiredArgsConstructor
@Slf4j
public class VoteAsyncService {

    private final VoteRepo voteRepo;
    private final SimpMessagingTemplate messagingTemplate;

    @Async
    public void process(UUID seasonId,
                        UUID participationId,
                        UUID authId,
                        String action,
                        String type,
                        long score) {

        try {
            // ================= DB =================
            if ("VOTE".equals(type) || "KILL".equals(type)) {
                voteRepo.upsert(participationId, authId, action);
            } else {
                voteRepo.deleteByParticipationIdAndAuthId(participationId, authId);
            }

            // ================= WS =================
            messagingTemplate.convertAndSend(
                    "/topic/votes/" + seasonId,
                    new Broadcast(
                            participationId,
                            score   // 🔥 rank removed
                    )
            );

        } catch (Exception e) {
            log.error("Async failed", e);
        }
    }
}