package com.example.aitestgenerator.exceptions;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {

  private final String message;

  public ResourceNotFoundException(final String message) {
    super(message);
    this.message = message;
  }
}
