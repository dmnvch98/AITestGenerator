package com.example.generation_service.dto.users;

import com.example.generation_service.models.UserFeature;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDto {

    private final Long id;
    private final String email;
    private final String firstName;
    private final String lastName;
    private final String role;
    private final UserFeature userFeature;
}
