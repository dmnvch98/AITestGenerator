package com.example.generation_service.repositories.user;

import com.example.generation_service.models.user.UserLoginHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;

public interface UserLoginRepository extends CrudRepository<UserLoginHistory, Long> {

    Page<UserLoginHistory> findAll(Pageable pageable);

    Page<UserLoginHistory> findAllByEmail(final String email, Pageable pageable);
}
