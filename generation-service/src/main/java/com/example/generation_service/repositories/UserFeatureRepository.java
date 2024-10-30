package com.example.generation_service.repositories;

import com.example.generation_service.models.UserFeature;
import org.springframework.data.repository.CrudRepository;

public interface UserFeatureRepository extends CrudRepository<UserFeature, Long> {

    UserFeature findByUserId(final Long userId);

}
