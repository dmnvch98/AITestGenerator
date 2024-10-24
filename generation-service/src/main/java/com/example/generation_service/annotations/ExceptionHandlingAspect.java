package com.example.generation_service.annotations;

import com.example.generation_service.models.GenerateTestMessage;
import com.example.generation_service.models.TestGeneratingHistory;
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

//        if (history != null) {
////            activityService.failGeneration(history, ex);
//        } else if (message != null) {
//            activityService.failActivityIfFatal(message.getReceipt(), ex);
//        } else {
//            activityService.failActivityIfFatal(ex);
//        }

    }
}
