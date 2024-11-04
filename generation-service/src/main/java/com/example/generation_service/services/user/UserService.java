package com.example.generation_service.services.user;

import com.example.generation_service.config.security.PasswordConfig;
import com.example.generation_service.dto.auth.CredentialsDto;
import com.example.generation_service.models.user.User;
import com.example.generation_service.repositories.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    public void updateRefreshToken(final User user, final String token) {
        userRepository.updateRefreshToken(user.getEmail(), token);
    }

    public void clearRefreshToken(final String email) {
        userRepository.updateRefreshToken(email, null);
    }

    public User save(User user) {
        log.info("Saving user. Email: {}", user.getEmail());

        if (userRepository.existsByEmail(user.getEmail())) {
            log.error("User with such email already exists: {}", user.getEmail());
            throw new IllegalArgumentException("User with such email already exists");
        }

        return userRepository.save(user);
    }


    public User findUserById(Long id) {
        log.debug("Searching user by id: {}", id);
        return userRepository.findUserById(id);
    }
}
