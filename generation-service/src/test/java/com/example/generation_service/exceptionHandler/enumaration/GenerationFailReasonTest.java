package com.example.generation_service.exceptionHandler.enumaration;

import org.junit.jupiter.api.Test;

import java.net.SocketTimeoutException;

import static org.junit.jupiter.api.Assertions.*;

class GenerationFailReasonTest {

  @Test
  public void testSocketTimeout() {
    final SocketTimeoutException cause = new SocketTimeoutException("timeout");
    final Exception exception = new RuntimeException(cause);

    final GenerationFailReason actual = GenerationFailReason.extractFailureCode(exception);

    assertEquals(GenerationFailReason.SOCKET_TIMEOUT, actual);

  }

}