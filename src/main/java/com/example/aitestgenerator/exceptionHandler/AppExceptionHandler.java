package com.example.aitestgenerator.exceptionHandler;

import com.example.aitestgenerator.holder.TestGeneratingHistoryHolder;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.enums.FailReason;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import retrofit2.HttpException;

import java.net.SocketTimeoutException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@ControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class AppExceptionHandler {
    private final TestGeneratingHistoryHolder historyHolder;
    private final TestGeneratingHistoryService historyService;

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Error> handleException(ResponseStatusException e) {
        log.warn(e.getMessage());
        return ResponseEntity.status(e.getStatusCode()).body(createError(e.getStatusCode(), e.getReason()));
    }

    @ExceptionHandler(SocketTimeoutException.class)
    public ResponseEntity<Error> handleSocketTimeoutException(SocketTimeoutException e) {
        TestGeneratingHistory history = historyHolder.getHistory();
        log.error("SocketTimeoutException is thrown when generation test for text. User id: {}, Text id: {}, ",
            history.getUser().getId(), history.getText().getId());
        return handleException(e, FailReason.TIMEOUT_EXCEPTION, history);
    }

    @ExceptionHandler(HttpException.class)
    public ResponseEntity<Error> handleHttpException(HttpException e) {
        TestGeneratingHistory history = historyHolder.getHistory();

        log.error("HttpException is thrown when generation test for text. User id: {}, Text id: {}, ",
            history.getUser().getId(), history.getText().getId());

        return handleException(e, FailReason.HTTP_EXCEPTION, history);
    }

    private ResponseEntity<Error> handleException(Exception e, FailReason failReason, TestGeneratingHistory history) {
        history.setFailReason(failReason);
        updateTestGeneratingHistory(history);
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(createError(HttpStatus.INTERNAL_SERVER_ERROR,
                "Some error occurred when generating test. Please contact administrator or try later"));
    }

    private void updateTestGeneratingHistory(TestGeneratingHistory history) {
        history.setGenerationEnd(LocalDateTime.now(ZoneOffset.UTC));
        history.setGenerationStatus(GenerationStatus.FAILED);
        historyService.save(history);
        historyHolder.clearHistory();
    }

    private Error createError(HttpStatusCode httpStatus, String message) {
        return Error.builder()
            .httpStatus(httpStatus)
            .message(message)
            .dateTime(LocalDateTime.now())
            .build();
    }

    @Builder
    @Data
    static class Error {
        private String message;
        private HttpStatusCode httpStatus;
        private LocalDateTime dateTime;
    }
}
