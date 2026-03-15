package com.example.backend.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    private UUID id;              // user id
    private String email;         // user email
    private String mobileNumber;  // mobile number
    private String username;      // username
    private Boolean canVote;      // vote permission
    private Boolean canParticipate; // participation permission
}