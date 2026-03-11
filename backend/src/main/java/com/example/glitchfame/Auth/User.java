package com.example.glitchfame.Auth;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "auth_users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_auth_users_email", columnNames = "email"),
                @UniqueConstraint(name = "uk_auth_users_username", columnNames = "username"),
                @UniqueConstraint(name = "uk_auth_users_mobile", columnNames = "mobile_number")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Column(nullable = false)
    private String password;

    // PostgreSQL enum mapping
    @Enumerated(EnumType.STRING)
    @Column(name = "role", columnDefinition = "user_role", nullable = false)
    @Builder.Default
    private Role role = Role.USER;

    @PrePersist
    public void setDefaultRole() {
        if (this.role == null) {
            this.role = Role.USER;
        }
    }

    public enum Role {
        USER,
        ADMIN
    }

    @Column(name = "can_participate", nullable = false)
    @Builder.Default
    private boolean canParticipate = true;

    @Column(name = "can_vote", nullable = false)
    @Builder.Default
    private boolean canVote = true;

    @Column(name = "profile_picture", nullable = false, length = 500)
    @Builder.Default
    private String profilePicture =
            "https://res.cloudinary.com/demo/image/upload/v1/default_profile.png";
}