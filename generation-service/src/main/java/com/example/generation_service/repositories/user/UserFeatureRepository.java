package com.example.generation_service.repositories.user;

import com.example.generation_service.models.user.UserFeature;
import org.springframework.data.repository.CrudRepository;

public interface UserFeatureRepository extends CrudRepository<UserFeature, Long> {

    UserFeature findByUserId(final Long userId);

}
