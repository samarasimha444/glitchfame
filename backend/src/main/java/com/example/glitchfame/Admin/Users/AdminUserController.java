package com.example.glitchfame.Admin.Users;
import com.example.glitchfame.Auth.DTO.ProfileResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;




@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController{

    private final AdminUserService adminService;

    // GET USER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponseDTO> getUserProfile(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserProfileById(id));
    }

    // TOGGLE CAN VOTE
    @PatchMapping("/{id}/toggle-vote")
    public ResponseEntity<String> toggleCanVote(@PathVariable Long id) {
        adminService.toggleCanVote(id);
        return ResponseEntity.ok("User voting permission toggled");
    }

    // TOGGLE CAN PARTICIPATE
    @PatchMapping("/{id}/toggle-participate")
    public ResponseEntity<String> toggleCanParticipate(@PathVariable Long id) {
        adminService.toggleCanParticipate(id);
        return ResponseEntity.ok("User participation permission toggled");
    }

    // DELETE USER (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUserByAdmin(id);
        return ResponseEntity.ok("User deleted successfully");}}