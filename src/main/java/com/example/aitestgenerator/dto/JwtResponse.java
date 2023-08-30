package com.example.aitestgenerator.dto;

import lombok.Value;

@Value
public class JwtResponse {
    String accessToken;
    String refreshToken;
}
