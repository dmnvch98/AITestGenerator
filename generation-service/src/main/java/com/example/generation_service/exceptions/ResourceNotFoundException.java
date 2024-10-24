package com.example.generation_service.exceptions;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {

  private final String message;

  public ResourceNotFoundException(final String message) {
    super(message);
    this.message = message;
  }
}
