package com.example.generation_service.repositories.user;

import com.example.generation_service.models.user.UserFeature;
import com.example.generation_service.models.user.Feature;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserFeatureRepository extends CrudRepository<UserFeature, Long> {

    List<UserFeature> findByUserId(final Long userId);

    UserFeature findByUserIdAndName(Long user_id, Feature name);

}
