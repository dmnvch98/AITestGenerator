package com.example.aitestgenerator.controllers;

import java.time.Duration;


import com.example.aitestgenerator.config.security.jwt.Jwt;
import com.example.aitestgenerator.dto.auth.CredentialsDto;
import com.example.aitestgenerator.dto.auth.JwtResponse;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

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
            final User user = userService.findUserByEmail(credentials.getEmail());
            final String accessToken = jwt.generateAccessToken(user);
            generateRefreshToken(user, user.getEmail(), response);
            return ResponseEntity.ok(JwtResponse.builder().accessToken(accessToken).build());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshTokens(
        final HttpServletRequest request,
        final HttpServletResponse response
    ) {
        final Cookie requestCookie = WebUtils.getCookie(request, "JWT_REFRESH");
        String refreshToken = null;
        if (requestCookie != null) {
            refreshToken = requestCookie.getValue();
        }
        if (jwt.validateRefreshToken(refreshToken)) {

            final String email = jwt.getLoginFromRefreshToken(refreshToken);
            User user = userService.findUserByEmail(email);
            if (user.getRefreshToken() != null && user.getRefreshToken().equals(refreshToken)) {
                final String newAccessToken = jwt.generateAccessToken(user);
                generateRefreshToken(user, user.getEmail(), response);
                return ResponseEntity.ok(JwtResponse.builder().accessToken(newAccessToken).build());
            } else {
                log.debug("Refresh tokens are not the same");
            }
        } else {
            log.debug("Refresh token is not valid");
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/logout")
    public void logout(final HttpServletRequest request, final HttpServletResponse response) {
        Cookie requestCookie = WebUtils.getCookie(request, "JWT_REFRESH");
        if (requestCookie != null) {
            addCookie(response, "", 0);
        }
    }

    private void generateRefreshToken(User user, final String email, final HttpServletResponse response) {
        final String newRefreshToken = jwt.generateRefreshToken(email);
        user.setRefreshToken(newRefreshToken);
        userService.updateUser(user);
        addCookie(response, newRefreshToken, Duration.ofDays(30).toSeconds());
    }

    private void addCookie(final HttpServletResponse response, final String value, final long maxAge) {
        Cookie cookie = new Cookie("JWT_REFRESH", value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setDomain(cookieDomain);
        cookie.setMaxAge((int) maxAge);
        response.addCookie(cookie);
    }
}
