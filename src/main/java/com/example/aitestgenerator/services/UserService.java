package com.example.aitestgenerator.services;

import com.example.aitestgenerator.config.security.PasswordConfig;
import com.example.aitestgenerator.dto.auth.CredentialsDto;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final PasswordConfig passwordConfig;

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

    public User updateUser(User user) {
        try {
            return userRepository.save(user);
        } catch (Exception e) {
            log.error("An error occurred during updating user. User ID {} " +
                "\nError: {}", user.getId(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred during updating user");
        }
    }

    public User save(User user) {
        log.info("Saving user. Email: {}", user.getEmail());
        return userRepository.save(user);
    }

    public User findUserById(Long id) {
        log.debug("Searching user by id: {}", id);
        return userRepository.findUserById(id);
    }
}
