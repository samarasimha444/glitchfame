package com.example.backend.auth;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UuidGenerator;

import java.util.UUID;

@Entity
@Table(
        name = "auth",
        uniqueConstraints = {
                @UniqueConstraint(name = "auth_email_key", columnNames = "email"),
                @UniqueConstraint(name = "auth_mobile_key", columnNames = "mobile"),
                @UniqueConstraint(name = "auth_username_key", columnNames = "username")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Auth {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(name = "auth_id", nullable = false, updatable = false)
    private UUID authId;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "username", nullable = false, length = 100)
    private String username;

    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "role", nullable = false, length = 50)
    private String role = "USER";

    @Column(name = "can_participate")
    private Boolean canParticipate = true;

    @Column(name = "can_vote")
    private Boolean canVote = true;
}