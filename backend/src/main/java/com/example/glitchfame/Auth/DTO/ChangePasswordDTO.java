package com.example.glitchfame.Auth.DTO;

import lombok.Data;

@Data
public class ChangePasswordDTO {

    private String currentPassword;
    private String newPassword;
}