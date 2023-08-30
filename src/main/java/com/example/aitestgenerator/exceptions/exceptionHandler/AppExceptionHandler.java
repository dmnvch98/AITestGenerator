package com.example.aitestgenerator.exceptions.exceptionHandler;

import com.example.aitestgenerator.exceptions.AppException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class AppExceptionHandler {
    @ExceptionHandler(AppException.class)
    public ResponseEntity<String> handleFeignStatusException(AppException e) {
        return ResponseEntity.status(e.getHttpStatus()).body(e.getMessage());
    }
}
