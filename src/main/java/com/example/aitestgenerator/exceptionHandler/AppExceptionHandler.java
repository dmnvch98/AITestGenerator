package com.example.aitestgenerator.exceptionHandler;

import com.example.aitestgenerator.exceptions.*;
import com.example.aitestgenerator.holder.TestGeneratingHistoryHolder;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.FailReason;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
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
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import retrofit2.HttpException;

import java.net.SocketTimeoutException;
import java.time.LocalDateTime;
import java.util.Optional;

@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class AppExceptionHandler extends ResponseEntityExceptionHandler {

    private final TestGeneratingHistoryHolder historyHolder;
    private final TestGeneratingHistoryService historyService;

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

    @ExceptionHandler(SocketTimeoutException.class)
    public ResponseEntity<ApiErrorResponse> handleSocketTimeoutException(SocketTimeoutException e) {
        TestGeneratingHistory history = historyHolder.getHistory();
        log.error("SocketTimeoutException is thrown when generation test for text. User id: {}, Text id: {}, ",
            history.getUser().getId(), history.getText().getId());
        return handleException(e, FailReason.TIMEOUT_EXCEPTION, history);
    }

    @ExceptionHandler(HttpException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpException(HttpException e) {
        TestGeneratingHistory history = historyHolder.getHistory();

        log.error("HttpException is thrown when generation test for text. User id: {}, Text id: {}, ",
            history.getUser().getId(), history.getText().getId());

        return handleException(e, FailReason.HTTP_EXCEPTION, history);
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

    private ResponseEntity<ApiErrorResponse> handleException(Exception e, FailReason failReason, TestGeneratingHistory history) {
        history.setFailReason(failReason);
        updateTestGeneratingHistory(history);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(createError(HttpStatus.INTERNAL_SERVER_ERROR,
                "Some error occurred when generating test. Please contact administrator or try later"));
    }

    private void updateTestGeneratingHistory(TestGeneratingHistory history) {
        history.setGenerationEnd(LocalDateTime.now());
        history.setGenerationStatus(GenerationStatus.FAILED);
        historyService.save(history);
        historyHolder.clearHistory();
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
