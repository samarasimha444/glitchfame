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
            Map result = cloudinary.api().deleteResourcesByPrefix(
                    folderPath,
                    ObjectUtils.emptyMap()
            );

            // invalidate cached versions
            cloudinary.api().deleteResourcesByPrefix(
                    folderPath,
                    ObjectUtils.asMap("invalidate", true)
            );

        } catch (Exception e) {
            throw new RuntimeException("Failed to delete Cloudinary folder: " + folderPath);
        }
    }
}