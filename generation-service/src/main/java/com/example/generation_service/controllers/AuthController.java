package com.example.generation_service.controllers;

import java.time.Duration;
import java.time.LocalDateTime;


import com.example.generation_service.config.security.jwt.Jwt;
import com.example.generation_service.dto.auth.CredentialsDto;
import com.example.generation_service.dto.auth.JwtResponse;
import com.example.generation_service.models.user.User;
import com.example.generation_service.models.user.UserLoginHistory;
import com.example.generation_service.services.user.UserLoginHistoryService;
import com.example.generation_service.services.user.UserService;
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
    private final UserLoginHistoryService loginHistoryService;
    private final Jwt jwt;

    @Value("${csrf.cookie_domain}")
    public String cookieDomain;

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authorize(@RequestBody final CredentialsDto credentials,
                                                 HttpServletRequest request, HttpServletResponse response) {
        UserLoginHistory.UserLoginHistoryBuilder loginHistoryBuilder = extractLoginInfo(credentials, request);
        if (userService.verifyUser(credentials)) {
            final User user = userService.findUserByEmail(credentials.getEmail());
            final String accessToken = jwt.generateAccessToken(user);
            generateRefreshToken(user, user.getEmail(), response);
            final UserLoginHistory loginHistory = loginHistoryBuilder.success(true).build();
            loginHistoryService.save(loginHistory);
            return ResponseEntity.ok(JwtResponse.builder().accessToken(accessToken).build());
        } else {
            final UserLoginHistory loginHistory = loginHistoryBuilder.success(false).build();
            loginHistoryService.save(loginHistory);
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
        final String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            final String accessToken = authorizationHeader.substring(7);
            final String userEmail = jwt.getLoginFromAccessToken(accessToken);
            userService.clearRefreshToken(userEmail);
        }
        Cookie requestCookie = WebUtils.getCookie(request, "JWT_REFRESH");
        if (requestCookie != null) {
            addCookie(response, "", 0);
        }
    }

    private void generateRefreshToken(User user, final String email, final HttpServletResponse response) {
        final String newRefreshToken = jwt.generateRefreshToken(email);
        userService.updateRefreshToken(user, newRefreshToken);
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

    private UserLoginHistory.UserLoginHistoryBuilder extractLoginInfo(final CredentialsDto credentials, final HttpServletRequest request) {
        final String ipAddress = request.getRemoteAddr();
        final String userAgent = request.getHeader("User-Agent");
        return UserLoginHistory.builder()
                .email(credentials.getEmail())
                .loginTime(LocalDateTime.now())
                .ipAddress(ipAddress)
                .userAgent(userAgent);
    }

}
