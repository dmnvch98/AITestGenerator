package com.example.generation_service.repositories.user;

import com.example.generation_service.models.user.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends CrudRepository<User, Long> {
    User findUserByEmail(String email);

    User findUserById(Long id);

    Boolean existsByEmail(final String email);

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.refreshToken = :value WHERE u.email = :email")
    void updateRefreshToken(@Param("email") final String email, @Param("value") final String value);
}
