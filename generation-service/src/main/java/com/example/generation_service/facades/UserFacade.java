package com.example.generation_service.facades;

import com.example.generation_service.config.security.PasswordConfig;
import com.example.generation_service.converters.UserConverter;
import com.example.generation_service.dto.users.CreateUserRequestDto;
import com.example.generation_service.dto.users.UserResponseDto;
import com.example.generation_service.exceptions.ResourceNotFoundException;
import com.example.generation_service.models.User;
import com.example.generation_service.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserFacade {
    private final UserService userService;
    private final UserConverter userConverter;
    private final PasswordConfig passwordConfig;

    public UserResponseDto save(final CreateUserRequestDto userDto) {
        User user = userConverter.createUserDtoToUser(userDto);
        String hashedPassword = passwordConfig.passwordEncoder().encode(userDto.getPassword());
        user.setPassword(hashedPassword);
        user = userService.save(user);
        return userConverter.userToCreateUserResponseDto(user);
    }

    public UserResponseDto getUser(final Long userId) {
        return Optional.ofNullable(userService.findUserById(userId))
                .map(userConverter::userToCreateUserResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found"));
    }
}
