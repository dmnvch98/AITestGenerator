package com.example.aitestgenerator.exceptions.exceptionHandler;

import com.example.aitestgenerator.exceptions.AppException;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
@Slf4j
public class AppExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<Error> handleException(AppException e) {
        log.warn(e.getMessage());
        Error error = Error.builder()
            .dateTime(LocalDateTime.now())
            .status(e.getHttpStatus().value())
            .message(e.getMessage())
            .build();
        return ResponseEntity.status(e.getHttpStatus()).body(error);
    }

    @Builder
    @Data
    static class Error {
        private String message;
        private int status;
        private LocalDateTime dateTime;
    }
}
