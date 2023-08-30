package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.dto.CreateUserRequestDto;
import com.example.aitestgenerator.dto.CreateUserResponseDto;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateUserResponseDto save(@RequestBody CreateUserRequestDto userDto) {
        return userService.save(userDto);
    }

}
