package com.hotel.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hotel.dtos.UserDTO;
import com.hotel.entities.User;
import com.hotel.entities.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {
    /*
     * Get All Users from specified role , with reg amount <= specified amount
     */
    List<User> findByUserRoleAndRegAmountIsLessThanEqual(UserRole role, int amount);

    /*
     * Return count of users born after specified date
     */
    int countByDobAfter(LocalDate date);

    /*
     * Delete all users from specified role
     */
    int deleteByUserRole(UserRole role);

    /*
     * Get firstname , last name , dob of users from specified role , born
     * between specified start & end date
     */
    @Query("select new com.hotel.dtos.UserDTO(u.firstName,u.lastName,u.dob)  from User u where u.userRole=:rl and u.dob between :start and :end")
    List<UserDTO> getSelectedUserDetails(@Param("rl") UserRole role, @Param("start") LocalDate strt,
            @Param("end") LocalDate end1);

    // check if user already exists by same email or phone

    boolean existsByEmailOrPhone(String email, String phoneNo);
    // sign in

    Optional<User> findByEmailAndPassword(String email, String password);

    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);

    Optional<User> findByEmail(String email);

    boolean existsByPhone(String phone);

    List<User> findByAccountStatus(String accountStatus);
}
