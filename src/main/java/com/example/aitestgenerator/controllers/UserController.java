package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.dto.users.CreateUserRequestDto;
import com.example.aitestgenerator.dto.users.CreateUserResponseDto;
import com.example.aitestgenerator.facades.UserFacade;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    private final UserFacade userFacade;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CreateUserResponseDto save(@RequestBody CreateUserRequestDto userDto) {
        return userFacade.save(userDto);
    }

}
