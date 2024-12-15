package com.example.generation_service.exceptionHandler;

import com.example.generation_service.exceptions.*;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.Optional;

@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class AppExceptionHandler extends ResponseEntityExceptionHandler {

    protected ResponseEntity<Object> handleExceptionInternal(
        final Exception exception,
        @Nullable final Object body,
        final HttpHeaders headers,
        final HttpStatusCode statusCode,
        final WebRequest request
    ) {

        final Object responseBody = Optional.ofNullable(body)
            .orElseGet(() -> new ApiErrorResponse(exception, statusCode));

        return super.handleExceptionInternal(exception, responseBody, headers, statusCode, request);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleException(ResponseStatusException e) {
        log.warn(e.getMessage());
        return ResponseEntity.status(e.getStatusCode()).body(createError(e.getStatusCode(), e.getReason()));
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<Object> handleHttpException(final ResourceAlreadyExistsException e, final WebRequest request) {

        log.warn("Exception when uploading file. File already exists for the user. File name: {} , user id: {}",
            e.getFileName(), e.getUserId());

        return handleExceptionInternal(
            e,
            new ApiErrorResponse(e, HttpStatus.FORBIDDEN),
            new HttpHeaders(),
            HttpStatus.FORBIDDEN,
            request
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleHttpException(final ResourceNotFoundException e, final WebRequest request) {

        return handleExceptionInternal(
            e,
            new ApiErrorResponse(e, HttpStatus.NOT_FOUND),
            new HttpHeaders(),
            HttpStatus.NOT_FOUND,
            request
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleHttpException(final IllegalArgumentException e, final WebRequest request) {
        log.error("An error occurred...", e);
        return handleExceptionInternal(
              e,
              new ApiErrorResponse(e, HttpStatus.BAD_REQUEST),
              new HttpHeaders(),
              HttpStatus.BAD_REQUEST,
              request
        );
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            final MethodArgumentNotValidException ex,
            final HttpHeaders headers,
            final HttpStatusCode status,
            final WebRequest request) {

        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                .httpStatus(HttpStatus.BAD_REQUEST)
                .message("Validation failed: " + ex.getBindingResult().getAllErrors().get(0).getDefaultMessage())
                .build();

        String requestUrl = request.getDescription(false).replace("uri=", "");

        log.error("Validation error occurred. URL: {}, Error: {}",
                requestUrl,
                ex.getMessage());

        return handleExceptionInternal(ex, errorResponse, headers, HttpStatus.BAD_REQUEST, request);
    }


    private ApiErrorResponse createError(HttpStatusCode httpStatus, String message) {
        return ApiErrorResponse.builder()
            .httpStatus(httpStatus)
            .message(message)
            .build();
    }

    @Builder
    @Data
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @AllArgsConstructor
    static class ApiErrorResponse {
        private String message;
        private HttpStatusCode httpStatus;
        private final LocalDateTime dateTime = LocalDateTime.now();

        ApiErrorResponse(final Exception e, final HttpStatusCode httpStatus) {
            this.message = e.getMessage();
            this.httpStatus = httpStatus;
        }
    }
}
