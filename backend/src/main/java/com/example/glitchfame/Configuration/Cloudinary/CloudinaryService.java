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

    private static final long MAX_SIZE = 5 * 1024 * 1024*2; // 5MB

    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/png", "image/jpg");


    // Upload image
    public String uploadImage(MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        if (file.getSize() > MAX_SIZE) {
            throw new RuntimeException("File size must be less than 5MB");
        }

        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Only JPG, JPEG, PNG files are allowed");
        }

        try {

            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "glitchfame/contestants/profile",
                            "resource_type", "image"
                    )
            );

            // ===== DEBUG CONSOLE OUTPUT =====
            System.out.println("===== CLOUDINARY RESPONSE =====");
            System.out.println(result);

            System.out.println("Secure URL: " + result.get("secure_url"));
            System.out.println("Public ID: " + result.get("public_id"));
            System.out.println("URL: " + result.get("url"));
            System.out.println("Format: " + result.get("format"));
            System.out.println("Width: " + result.get("width"));
            System.out.println("Height: " + result.get("height"));
            System.out.println("================================");

            return result.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Upload failed", e);
        }
    }


    // Delete entire folder
    public void deleteFolderCompletely(String folder) {

        try {

            // delete all assets inside the folder
            cloudinary.api().deleteResourcesByPrefix(
                    folder + "/",
                    ObjectUtils.emptyMap()
            );

            // delete subfolders
            cloudinary.api().deleteFolder(
                    folder + "/contestants",
                    ObjectUtils.emptyMap()
            );

            // delete main folder
            cloudinary.api().deleteFolder(
                    folder,
                    ObjectUtils.emptyMap()
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete folder: " + folder, e);
        }
    }
}