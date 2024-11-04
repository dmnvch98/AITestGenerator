package com.example.generation_service.repositories.user;

import com.example.generation_service.models.user.UserLoginHistory;
import org.springframework.data.repository.CrudRepository;

public interface UserLoginRepository extends CrudRepository<UserLoginHistory, Long> {
}
