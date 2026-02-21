package com.example.glitchfame.Controller;
import com.example.glitchfame.Service.ParticipationService;
import com.example.glitchfame.dto.ParticipationRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/participations")
@RequiredArgsConstructor
public class ParticipationController {

    private final ParticipationService participationService;

    @PostMapping
    public ResponseEntity<?> createParticipation(
            @RequestBody ParticipationRequestDTO request) {

        try {

            participationService.createParticipation(request);

            return ResponseEntity.status(201)
                    .body("Participation submitted successfully");

        } catch (RuntimeException ex) {

            switch (ex.getMessage()) {

                case "USER_NOT_FOUND":
                    return ResponseEntity.status(404)
                            .body("User not found");

                case "SEASON_NOT_FOUND":
                    return ResponseEntity.status(404)
                            .body("Season not found");

                case "ALREADY_PARTICIPATED":
                    return ResponseEntity.status(409)
                            .body("You have already participated in this season");

                default:
                    return ResponseEntity.status(500)
                            .body("Something went wrong");
            }
        }
    }
}