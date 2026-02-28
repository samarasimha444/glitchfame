package com.example.glitchfame.Auth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import org.springframework.data.repository.query.Param;
import java.util.List;
import com.example.glitchfame.Auth.DTO.UserSearchProjection;
import org.springframework.data.domain.Pageable;


public interface AuthRepository extends JpaRepository<User, Long> {

    // Login
    Optional<User> findByEmail(String email);

     // Registration validations
     boolean existsByEmail(String email);
     boolean existsByUsername(String username);
     boolean existsByMobileNumber(String mobileNumber);


    // Update profile picture
    @Modifying
    @Query("UPDATE User u SET u.profilePicture = :url WHERE u.id = :userId")
    int updateProfilePicture(@Param("userId") Long userId,
                         @Param("url") String url);




    // Reset to default profile picture
    @Modifying
    @Query("UPDATE User u SET u.profilePicture = :defaultUrl WHERE u.id = :userId")
    int resetProfilePicture(@Param("userId") Long userId,
                        @Param("defaultUrl") String defaultUrl);

    


    // Search users by username
    @Query("""
    SELECT u.id AS id,
              u.username AS username,
              u.profilePicture AS profilePicture
    FROM User u
    WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
       """)
    List<UserSearchProjection> searchByUsername(
        @Param("keyword") String keyword,
        Pageable pageable
);



    //delete user
      void deleteById(Long id);
    
}