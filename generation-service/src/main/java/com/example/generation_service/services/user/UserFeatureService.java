package com.example.generation_service.services.user;

import com.example.generation_service.models.user.UserFeature;
import com.example.generation_service.models.user.Feature;
import com.example.generation_service.repositories.user.UserFeatureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserFeatureService {

    private final UserFeatureRepository userFeatureRepository;

    public Map<Feature, Boolean> initializeUserFeatures() {
        return Map.of(
                Feature.ANTIVIRUS_ENABLED, true
        );
    }

    public List<UserFeature> getUserFeatures(final Long userId) {
        return userFeatureRepository.findByUserId(userId);
    }

    public UserFeature getUserFeature(final Long userId, final Feature featureName) {
        return userFeatureRepository.findByUserIdAndName(userId, featureName);
    }

    public UserFeature updateUserFeature(final long userId, final Feature featureName, final boolean enabled) {
        final UserFeature userFeature = userFeatureRepository.findByUserIdAndName(userId, featureName);
        userFeature.setEnabled(enabled);
        userFeature.setUpdatedAt(LocalDateTime.now());
        return userFeatureRepository.save(userFeature);
    }
}
