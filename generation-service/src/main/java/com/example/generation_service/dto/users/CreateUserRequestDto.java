package com.example.generation_service.dto.users;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Builder
@ToString
@Getter
public class CreateUserRequestDto {
    private String email;
    private String password;
}
