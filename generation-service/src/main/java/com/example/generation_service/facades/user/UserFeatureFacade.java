package com.example.generation_service.facades.user;

import com.example.generation_service.dto.users.UpdateUserFeatureRequestDto;
import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.models.user.Feature;
import com.example.generation_service.models.user.UserFeature;
import com.example.generation_service.services.user.UserFeatureService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserFeatureFacade {

    private final UserFeatureService userFeatureService;

    public UserFeature updateUserFeature(final Long userId, UpdateUserFeatureRequestDto dto) {
        final Feature feature = parseUserFeature(dto.getFeatureName());
        return userFeatureService.updateUserFeature(userId, feature, dto.getEnabled());
    }

    private Feature parseUserFeature(final String featureName) {
        try {
            return Feature.valueOf(featureName);
        } catch (IllegalArgumentException e) {
            log.error("Feature {} not found", featureName);
            throw new ResourceNotFoundException("Feature " + featureName + " not found");
        }
    }
}
