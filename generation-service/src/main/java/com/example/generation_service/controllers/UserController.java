package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.users.CreateUserRequestDto;
import com.example.generation_service.dto.users.UserResponseDto;
import com.example.generation_service.facades.UserFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserFacade userFacade;

    @PostMapping("/sign-up")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDto save(@RequestBody CreateUserRequestDto userDto) {
        return userFacade.save(userDto);
    }

    @GetMapping("/me")
    public UserResponseDto getMe(final Authentication authentication) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return userFacade.getUser(userId);
    }
}
