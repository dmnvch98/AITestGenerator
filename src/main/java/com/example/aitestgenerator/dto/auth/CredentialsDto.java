package com.example.aitestgenerator.dto.auth;

import lombok.Builder;
import lombok.Value;
import lombok.extern.jackson.Jacksonized;

@Jacksonized
@Builder
@Value
public class CredentialsDto {
  String email;
  String password;
}
