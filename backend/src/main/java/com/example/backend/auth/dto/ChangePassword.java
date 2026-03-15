package com.example.backend.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePassword{

    private String currentPassword; // user's existing password
    private String newPassword;     // password to update to
}