package com.example.backend.participation;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(
    name = "participation",
    uniqueConstraints = {
        @UniqueConstraint(name = "unique_auth_season", columnNames = {"auth_id","season_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participation {

    @Id
    @GeneratedValue
    @Column(name = "participation_id")
    private UUID participationId;

    @Column(name = "auth_id", nullable = false)
    private UUID authId;

    @Column(name = "season_id", nullable = false)
    private UUID seasonId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "PENDING";

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "modified_at")
    private Instant modifiedAt;

    @Column(name = "votes", nullable = false)
private int votes = 0;

@Column(name = "kills", nullable = false)
private int kills = 0;

@Column(name = "score", insertable = false, updatable = false)
private long score;

@Column(name = "player_rank")
private Integer rank;

}