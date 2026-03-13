package com.example.glitchfame.Admin.Cloudinary;

import com.example.glitchfame.Configuration.Cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    // delete all assets of a season
    @DeleteMapping("/season/{seasonId}")
    public ResponseEntity<String> deleteSeasonAssets(
            @PathVariable Long seasonId
    ) {

        cloudinaryService.deleteSeasonAssets(seasonId);

        return ResponseEntity.ok(
                "Season assets deleted successfully for season: " + seasonId
        );
    }
}