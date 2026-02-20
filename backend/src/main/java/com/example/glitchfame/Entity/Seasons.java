package com.example.glitchfame.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "seasons",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "name")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Seasons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100, unique = true)
    private String name;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal prizeMoney;

    @Column(nullable = false)
    private LocalDateTime registrationStartDate;

    @Column(nullable = false)
    private LocalDateTime registrationEndDate;

    @Column(nullable = false)
    private LocalDateTime votingStartDate;

    @Column(nullable = false)
    private LocalDateTime votingEndDate;

    @Column(nullable = false)
    private Boolean deleted = false;

    // MVP: no foreign key relation yet
    @Column(nullable = true)
    private Long winnerId;
}