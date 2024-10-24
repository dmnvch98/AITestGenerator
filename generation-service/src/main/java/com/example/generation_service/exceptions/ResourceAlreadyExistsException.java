package com.example.generation_service.exceptions;

import lombok.Getter;

@Getter
public class ResourceAlreadyExistsException extends RuntimeException {

  private final String fileName;
  private final long userId;

  public ResourceAlreadyExistsException(final String fileName, final long userId) {
    super("File already exists for the user. File name: " + fileName + ", user id: " + userId);
    this.fileName = fileName;
    this.userId = userId;
  }
}
