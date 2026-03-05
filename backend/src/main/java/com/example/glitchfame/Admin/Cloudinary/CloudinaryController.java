package com.example.glitchfame.Admin.Cloudinary;
import com.example.glitchfame.Configuration.Cloudinary.*;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;


    // Delete entire folder
    @DeleteMapping("/delete-folder/{folder}")
    public ResponseEntity<String> deleteFolder(@PathVariable String folder) {

        cloudinaryService.deleteFolderCompletely(folder);
        return ResponseEntity.ok("Folder deleted successfully: " + folder);
    }

}