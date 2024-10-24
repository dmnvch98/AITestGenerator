package com.example.generation_service.dto.auth;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class JwtResponse {
    private String accessToken;
}
