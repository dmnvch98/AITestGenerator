package com.example.aitestgenerator.exceptions.exceptionHandler;

import com.example.aitestgenerator.models.GenerationStatus;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

import java.net.SocketTimeoutException;

import static com.example.aitestgenerator.utils.Utils.getGMT;

@Aspect
@Slf4j
@Component
@RequiredArgsConstructor
public class TimeOutExceptionHandlingAspect {
    private final TestGeneratingHistoryService textGenerationHistoryService;

    @Around("@annotation(HandleTimeoutException)")
    public Object handleTimeoutException(ProceedingJoinPoint joinPoint) throws Throwable {
        Object[] methodArgs = joinPoint.getArgs();

        if (methodArgs.length == 2 && methodArgs[0] instanceof Text text && methodArgs[1] instanceof TestGeneratingHistory history) {

            try {
                return joinPoint.proceed();
            } catch (SocketTimeoutException e) {
                log.error("TimeoutException occurred when generation test for text. Text id: {}, User id: {}",
                    text.getId(), text.getUserId());
                updateTestGeneratingHistory(history);
            }
        } else {
            throw new IllegalArgumentException("HandleTimeoutException annotation calls for invalid method");
        }
        return null;
    }

    private void updateTestGeneratingHistory(TestGeneratingHistory history) {
        history.setGenerationEnd(getGMT());
        history.setGenerationStatus(GenerationStatus.FAILED);
        textGenerationHistoryService.save(history);
    }

}
