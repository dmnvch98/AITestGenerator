package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
    User findUserByEmail(String email);

    User findUserById(Long id);

    Boolean existsByEmail(final String email);
}
