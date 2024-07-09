package com.example.aitestgenerator.exceptions;

import lombok.Getter;

@Getter
public class ResourceNotFoundException extends RuntimeException {

  private final String fileName;
  private final long userId;

  public ResourceNotFoundException(final String fileName, final long userId) {
    super("File " + fileName + " is not found");
    this.fileName = fileName;
    this.userId = userId;
  }
}
