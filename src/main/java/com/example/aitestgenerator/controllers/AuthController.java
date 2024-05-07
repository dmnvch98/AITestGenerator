package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.jwt.Jwt;
import com.example.aitestgenerator.dto.auth.CredentialsDto;
import com.example.aitestgenerator.dto.auth.JwtResponse;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/auth")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final UserService userService;
    private final Jwt jwt;

    @Value("${csrf.cookie_domain}")
    public String cookieDomain;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authorize(@RequestBody final CredentialsDto credentials, HttpServletResponse response) {
        if (userService.verifyUser(credentials)) {
            User user = userService.findUserByEmail(credentials.getEmail());
            String accessToken = jwt.generateAccessToken(user);
            String refreshToken = jwt.generateRefreshToken(user.getEmail());
            user.setRefreshToken(refreshToken);
            userService.updateUser(user);
            return ResponseEntity.ok(new JwtResponse(accessToken, refreshToken));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
