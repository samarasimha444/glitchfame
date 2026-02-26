package com.example.glitchfame.Contestants.DTO;
import java.time.LocalDate;
import lombok.Data;





@Data
public class CreateContestantDTO {

    private Long seasonId;
    private String name;
    private String description;
    private LocalDate dateOfBirth;
    private String location;
    private String photoUrl;
}
    

