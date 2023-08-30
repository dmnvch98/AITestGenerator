package com.example.aitestgenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreateUserRequestDto {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
    private String role;
}
