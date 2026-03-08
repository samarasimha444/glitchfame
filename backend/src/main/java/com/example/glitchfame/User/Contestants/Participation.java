package com.example.glitchfame.User.Contestants;

import com.example.glitchfame.Auth.User;
import com.example.glitchfame.User.Seasons.Seasons;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(
        name = "participations",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_user_season",
                        columnNames = {"user_id", "season_id"}
                )
        },
        indexes = {
                @Index(name = "idx_participation_user_id", columnList = "user_id"),
                @Index(name = "idx_participation_season_id", columnList = "season_id"),
                @Index(name = "idx_participation_location", columnList = "location"),
                @Index(name = "idx_participation_dob", columnList = "date_of_birth"),
                @Index(name = "idx_participation_status", columnList = "status"),
                @Index(name = "idx_participation_name", columnList = "name")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many participations -> One user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many participations -> One season
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Seasons season;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "photo_url", nullable = false, length = 500)
    private String photoUrl;

    public enum Status {
        PENDING,
        REJECTED,
        APPROVED
    }



 @CreationTimestamp
@Column(name = "created_at", nullable = false, updatable = false)
private LocalDateTime createdAt;
}