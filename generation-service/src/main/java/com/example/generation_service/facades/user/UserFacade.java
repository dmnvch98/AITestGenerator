package com.example.generation_service.facades.user;

import com.example.generation_service.config.security.PasswordConfig;
import com.example.generation_service.converters.UserConverter;
import com.example.generation_service.dto.users.CreateUserRequestDto;
import com.example.generation_service.dto.users.UserResponseDto;
import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.models.user.User;
import com.example.generation_service.services.user.UserFeatureService;
import com.example.generation_service.services.user.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserFacade {

    private final UserService userService;
    private final UserFeatureService userFeatureService;
    private final UserConverter userConverter;
    private final PasswordConfig passwordConfig;

    public UserResponseDto save(final CreateUserRequestDto userDto) {
        final String hashedPassword = passwordConfig.passwordEncoder().encode(userDto.getPassword());
        final User user = userConverter.createUserDtoToUser(userDto, hashedPassword);
        user.initializeFeatures(userFeatureService.initializeUserFeatures());
        userService.save(user);
        return userConverter.userToCreateUserResponseDto(user);
    }

    public UserResponseDto getUser(final Long userId) {
        return Optional.ofNullable(userService.findUserById(userId))
                .map(userConverter::userToCreateUserResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found"));
    }
}
