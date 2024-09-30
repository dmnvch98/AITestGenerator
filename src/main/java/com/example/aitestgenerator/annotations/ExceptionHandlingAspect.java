package com.example.aitestgenerator.annotations;

import com.example.aitestgenerator.models.GenerateTestMessage;
import com.example.aitestgenerator.models.TestGeneratingHistory;
import com.example.aitestgenerator.services.ActivityService;
import com.example.aitestgenerator.services.TestGeneratingHistoryService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class ExceptionHandlingAspect {

    private static final Logger log = LoggerFactory.getLogger(ExceptionHandlingAspect.class);
    private final ActivityService activityService;

  @Pointcut("@annotation(StopGenerationIfException)")
    public void catchExceptionAndHandle() {}

    @AfterThrowing(pointcut = "catchExceptionAndHandle()", throwing = "ex")
    public void handleException(JoinPoint joinPoint, Exception ex) {
        log.warn("[EXCEPTION_HANDLING_ASPECT]: Catched exception: {}", ex.getMessage());
        final Object[] methodArgs = joinPoint.getArgs();
        TestGeneratingHistory history = null;
        GenerateTestMessage message = null;

        for (Object arg : methodArgs) {
            if (arg instanceof TestGeneratingHistory) {
                history = (TestGeneratingHistory) arg;
            }
            if (arg instanceof GenerateTestMessage) {
                message = (GenerateTestMessage) arg;
            }
        }

        if (history != null) {
            activityService.failGeneration(history, ex);
        } else if (message != null) {
            activityService.failGeneration(message.getReceipt(), ex);
        } else {
            activityService.failGeneration(ex);
        }

    }
}
