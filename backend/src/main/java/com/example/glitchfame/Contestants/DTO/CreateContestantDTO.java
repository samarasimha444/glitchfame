package com.example.glitchfame.Contestants.DTO;
import java.time.LocalDate;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;





@Data
public class CreateContestantDTO {

    private Long seasonId;
    private String name;
    private String description;
    private LocalDate dateOfBirth;
    private String location;
    private MultipartFile image;
}
    

