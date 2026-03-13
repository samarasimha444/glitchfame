package com.example.glitchfame.Configuration.Cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    private static final long MAX_SIZE = 10 * 1024 * 1024; // 10MB

    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/png", "image/jpg");


    // Upload image season-wise
    public String uploadImage(MultipartFile file, Long seasonId) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new RuntimeException("File size must be less than 10MB");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Only JPG, JPEG, PNG files are allowed");
        }

        try {

            // season based folder
            String folder = "glitchfame/seasons/season-" + seasonId + "/contestants";

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "resource_type", "image"
                    )
            );

            System.out.println("Uploaded to: " + folder);
            System.out.println("Public ID: " + result.get("public_id"));

            return result.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Upload failed", e);
        }
    }


    // Delete all images of a season
    public void deleteSeasonAssets(Long seasonId) {

        String folder = "glitchfame/seasons/season-" + seasonId;

        try {

            cloudinary.api().deleteResourcesByPrefix(
                    folder,
                    ObjectUtils.emptyMap()
            );

            cloudinary.api().deleteFolder(
                    folder + "/contestants",
                    ObjectUtils.emptyMap()
            );

            cloudinary.api().deleteFolder(
                    folder,
                    ObjectUtils.emptyMap()
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete season assets", e);
        }
    }
}