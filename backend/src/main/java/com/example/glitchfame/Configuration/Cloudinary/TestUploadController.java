package com.example.glitchfame.Configuration.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.MediaType;
import java.util.Collection;
import jakarta.servlet.http.Part;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestUploadController {

    private final CloudinaryService cloudinaryService;




@PostMapping("/upload")
public ResponseEntity<String> testUpload(
        @RequestParam("file") MultipartFile file
) {
    String url = cloudinaryService.uploadImage(file);
    return ResponseEntity.ok(url);
}
}
