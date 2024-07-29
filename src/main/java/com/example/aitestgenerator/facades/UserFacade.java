package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.config.security.PasswordConfig;
import com.example.aitestgenerator.converters.TestGenerationHistoryConverter;
import com.example.aitestgenerator.converters.UserConverter;
import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.dto.users.CreateUserRequestDto;
import com.example.aitestgenerator.dto.users.UserResponseDto;
import com.example.aitestgenerator.exceptions.ResourceNotFoundException;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserFacade {
    private final UserService userService;
    private final UserConverter userConverter;
    private final PasswordConfig passwordConfig;
    private final TestGeneratingHistoryService testGeneratingHistoryService;
    private final TestGenerationHistoryConverter textGenerationHistoryConverter;

    public UserResponseDto save(final CreateUserRequestDto userDto) {
        User user = userConverter.createUserDtoToUser(userDto);
        String hashedPassword = passwordConfig.passwordEncoder().encode(userDto.getPassword());
        user.setPassword(hashedPassword);
        user = userService.save(user);
        return userConverter.userToCreateUserResponseDto(user);
    }

    public List<TextGenerationHistoryDto> getTestGenerationHistory(final Long userId) {
        return testGeneratingHistoryService.getAllByUserId(userId)
            .stream()
            .map(textGenerationHistoryConverter::historyToDto)
            .collect(Collectors.toList());
    }

    public UserResponseDto getUser(final Long userId) {
        return Optional.ofNullable(userService.findUserById(userId))
                .map(userConverter::userToCreateUserResponseDto)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found"));
    }
}
