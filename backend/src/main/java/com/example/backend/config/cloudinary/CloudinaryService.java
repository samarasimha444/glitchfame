package com.example.backend.config.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // delete all images inside a folder
    public void deleteFolder(String folderPath) {

        try {

            // delete resources inside folder
            cloudinary.api().deleteResourcesByPrefix(
                    folderPath,
                    ObjectUtils.emptyMap()
            );

            // invalidate cached versions
            cloudinary.api().deleteResourcesByPrefix(
                    folderPath,
                    ObjectUtils.asMap("invalidate", true)
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete Cloudinary folder: " + folderPath, e);
        }
    }

    // move image to another folder (rename public_id)
    public String moveImage(String oldPublicId, String newPublicId) {

        try {

            Map result = cloudinary.uploader().rename(
                    oldPublicId,
                    newPublicId,
                    ObjectUtils.asMap(
                            "overwrite", true,
                            "invalidate", true
                    )
            );

            return (String) result.get("secure_url");

        } catch (Exception e) {
            throw new RuntimeException("Failed to move Cloudinary image", e);
        }
    }




    public String extractPublicId(String url) {

    if (url == null || !url.contains("/upload/")) {
        throw new IllegalArgumentException("Invalid Cloudinary URL: " + url);
    }

    String[] parts = url.split("/upload/");
    String path = parts[1];

    path = path.substring(path.indexOf("/") + 1);

    return path.substring(0, path.lastIndexOf("."));
}
}