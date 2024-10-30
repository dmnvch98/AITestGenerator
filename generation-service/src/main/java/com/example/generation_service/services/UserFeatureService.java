package com.example.generation_service.services;

import com.example.generation_service.models.UserFeature;
import com.example.generation_service.repositories.UserFeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserFeatureService {

    private final UserFeatureRepository userFeatureRepository;

    public UserFeature createUserFeature() {
        return UserFeature.builder().build();
    }

    public UserFeature getUserFeatures(final Long userId) {
        return userFeatureRepository.findByUserId(userId);
    }
}
