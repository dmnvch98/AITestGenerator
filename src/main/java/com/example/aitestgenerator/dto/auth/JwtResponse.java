package com.example.aitestgenerator.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class JwtResponse {
    private String accessToken;
}
