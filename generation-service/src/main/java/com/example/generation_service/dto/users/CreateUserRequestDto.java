package com.example.generation_service.dto.users;

import com.example.generation_service.config.security.roles.Role;
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
    @Builder.Default
    private final Role role = Role.USER;
}
