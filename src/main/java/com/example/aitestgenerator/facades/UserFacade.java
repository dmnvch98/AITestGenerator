package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.config.security.PasswordConfig;
import com.example.aitestgenerator.converters.UserConverter;
import com.example.aitestgenerator.dto.users.CreateUserRequestDto;
import com.example.aitestgenerator.dto.users.CreateUserResponseDto;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserFacade {
    private final UserService userService;
    private final UserConverter userConverter;
    private final PasswordConfig passwordConfig;


    public User findUserByEmail(String email) {
        return userService.findUserByEmail(email);
    }

    public void updateUser(User user) {
        userService.updateUser(user);
    }

    public CreateUserResponseDto save(CreateUserRequestDto userDto) {
        User user = userConverter.createUserDtoToUser(userDto);
        String hashedPassword = passwordConfig.passwordEncoder().encode(userDto.getPassword());
        user.setPassword(hashedPassword);
        user = userService.save(user);
        return userConverter.userToCreateUserResponseDto(user);
    }

    public User findUserById(Long id) {
        return userService.findUserById(id);
    }
}
