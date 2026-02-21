package com.example.glitchfame.dto.UserDTO;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParticipationRequestDTO {

    @NotNull(message = "Season ID is required")
    private Long seasonId;

    @NotNull(message = "Age is required")
    @Min(value = 13, message = "Minimum age is 13")
    @Max(value = 100, message = "Invalid age")
    private Integer age;

    @NotBlank(message = "Mobile number is required")
    @Size(min = 10, max = 15, message = "Invalid mobile number")
    private String mobileNumber;

    @NotBlank(message = "Location is required")
    @Size(max = 100)
    private String location;

    @NotBlank(message = "Photo URL is required")
    private String photoUrl;

    @NotBlank(message = "Description is required")
    @Size(max = 2000)
    private String description;
}