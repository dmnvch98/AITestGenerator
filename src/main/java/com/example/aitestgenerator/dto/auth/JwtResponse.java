package com.example.aitestgenerator.dto.auth;

import lombok.Value;

@Value
public class JwtResponse {
    String accessToken;
    String refreshToken;
}
