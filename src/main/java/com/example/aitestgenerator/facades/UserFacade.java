package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.config.security.PasswordConfig;
import com.example.aitestgenerator.converters.TextGenerationHistoryConverter;
import com.example.aitestgenerator.converters.UserConverter;
import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.dto.users.CreateUserRequestDto;
import com.example.aitestgenerator.dto.users.CreateUserResponseDto;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserFacade {
    private final UserService userService;
    private final UserConverter userConverter;
    private final PasswordConfig passwordConfig;
    private final TestGeneratingHistoryService testGeneratingHistoryService;
    private final TextGenerationHistoryConverter textGenerationHistoryConverter;

    public CreateUserResponseDto save(CreateUserRequestDto userDto) {
        User user = userConverter.createUserDtoToUser(userDto);
        String hashedPassword = passwordConfig.passwordEncoder().encode(userDto.getPassword());
        user.setPassword(hashedPassword);
        user = userService.save(user);
        return userConverter.userToCreateUserResponseDto(user);
    }

    public List<TextGenerationHistoryDto> getTestGenerationHistory(Long userId) {
        return testGeneratingHistoryService.getAllByUserId(userId)
            .stream()
            .map(textGenerationHistoryConverter::historyToDto)
            .collect(Collectors.toList());
    }
}
