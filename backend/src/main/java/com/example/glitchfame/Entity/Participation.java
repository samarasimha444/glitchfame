package com.example.glitchfame.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "participations",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "season_id"})
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

    // 🔥 Relationships

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "season_id", nullable = false)
    private Seasons season;

    // 🔥 User Submission Fields

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false, length = 15)
    private String mobileNumber;

    @Column(nullable = false, length = 100)
    private String location;

    @Column(nullable = false)
    private String photoUrl; // store URL/path only

    @Column(nullable = false, length = 2000)
    private String description;

    // 🔥 Admin Controlled Status

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING;

    // 🔥 Audit Fields

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // 🔥 Auto Timestamp Handling

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = Status.PENDING;
        }
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 🔥 Enum Inside Same File

    public enum Status {
        PENDING,
        APPROVED,
        REJECTED
    }
}