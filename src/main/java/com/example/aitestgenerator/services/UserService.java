package com.example.aitestgenerator.services;

import com.example.aitestgenerator.config.security.PasswordConfig;
import com.example.aitestgenerator.converters.UserConverter;
import com.example.aitestgenerator.dto.users.CreateUserRequestDto;
import com.example.aitestgenerator.dto.users.CreateUserResponseDto;
import com.example.aitestgenerator.dto.auth.CredentialsDto;
import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordConfig passwordConfig;
    private final UserConverter userConverter;

    public User findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    public Boolean verifyUser(CredentialsDto credentialsDto) {
        log.info("Verifying user. Email: {}", credentialsDto.getEmail());
        User user = findUserByEmail(credentialsDto.getEmail());
        return user != null && passwordConfig
            .passwordEncoder()
            .matches(credentialsDto.getPassword(), user.getPassword());
    }

    public void updateUser(User user) {
        try {
            userRepository.save(user);
        } catch (Exception e) {
            log.error("An error occurred during updating user refresh token. User ID {} " +
                "\nError: {}", user.getId(), e.getMessage());
            throw new AppException("An error occurred during authentication", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public User save(User user) {
        log.info("Saving user. Email: {}", user.getEmail());
        return userRepository.save(user);
    }

    public User findUserById(Long id) {
        log.info("Searching user by id: {}", id);
        return userRepository.findUserById(id);
    }
}
