package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.service.PrincipalUser;
import com.example.aitestgenerator.dto.tests.TextGenerationHistoryDto;
import com.example.aitestgenerator.dto.users.CreateUserRequestDto;
import com.example.aitestgenerator.dto.users.CreateUserResponseDto;
import com.example.aitestgenerator.facades.UserFacade;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserFacade userFacade;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateUserResponseDto save(@RequestBody CreateUserRequestDto userDto) {
        return userFacade.save(userDto);
    }

    @GetMapping("/test-gen-history")
    public List<TextGenerationHistoryDto> getTestGenerationHistory(Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return userFacade.getTestGenerationHistory(userId);
    }
}
