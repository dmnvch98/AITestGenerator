package com.example.aitestgenerator.services;

import com.example.aitestgenerator.config.security.PasswordConfig;
import com.example.aitestgenerator.dto.auth.CredentialsDto;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.repositories.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserServiceTest {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private PasswordConfig passwordConfig;

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13.4-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void verifyUserWithCorrectCreds_Returns_True() {
        CredentialsDto credentials = CredentialsDto.builder().email("test@example.com").password("password").build();
        boolean result = userService.verifyUser(credentials);

        assertTrue(result);
    }

    @Test
    void verifyUserWithIncorrectPassword_Returns_False() {
        CredentialsDto credentials = CredentialsDto.builder().email("test@example.com").password("password1").build();
        boolean result = userService.verifyUser(credentials);

        assertFalse(result);
    }

    @Test
    void verifyUserWithIncorrectEmail_Returns_False() {
        CredentialsDto credentials = CredentialsDto.builder().email("test1@example.com").password("password").build();
        boolean result = userService.verifyUser(credentials);

        assertFalse(result);
    }

    @Test
    void updateUser_ReturnsUpdatedUser() {
        User foundUser = ((List<User>) userRepository.findAll()).get(0);
        foundUser.setEmail("updatedEmail@gmail.com");
        User updatedUser = userService.updateUser(foundUser);
        assertNotNull(updatedUser);
        assertEquals("updatedEmail@gmail.com", updatedUser.getEmail());
    }

    @BeforeEach
    void setUp() {
        User user = User.builder()
                .email("test@example.com")
                .password(passwordConfig.passwordEncoder().encode("password"))
                .build();
        userService.save(user);
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }


}
