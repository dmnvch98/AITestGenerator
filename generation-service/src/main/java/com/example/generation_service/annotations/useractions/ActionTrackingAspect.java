package com.example.generation_service.annotations.useractions;

import com.example.generation_service.annotations.enumeration.ActionType;
import com.example.generation_service.models.UserAction;
import com.example.generation_service.repositories.UserActionRepository;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class ActionTrackingAspect {

    private static final Logger log = LoggerFactory.getLogger(ActionTrackingAspect.class);
    private final UserActionRepository userActionRepository;

    @Before("@annotation(trackAction)")
    public void trackUserAction(JoinPoint joinPoint, TrackAction trackAction) {
        checkForUserIdParameter(joinPoint);
        final ActionType actionType = trackAction.value();
        final Long userId = getUserIdFromArgs(joinPoint);

        final UserAction userAction = UserAction.builder()
                .userId(userId)
                .actionType(actionType)
                .build();
        
        userActionRepository.save(userAction);
    }

    private void checkForUserIdParameter(JoinPoint joinPoint) {
        final String methodName = joinPoint.getSignature().getName();
        final String[] parameterNames = ((MethodSignature) joinPoint.getSignature()).getParameterNames();
        boolean userIdFound = false;

        for (String paramName : parameterNames) {
            if ("userId".equals(paramName)) {
                userIdFound = true;
                break;
            }
        }

        if (!userIdFound) {
            log.error("Method '{}' must contain 'userId'", methodName);
        }
    }


    private Long getUserIdFromArgs(JoinPoint joinPoint) {
        final Object[] args = joinPoint.getArgs();
        final String[] parameterNames = ((MethodSignature) joinPoint.getSignature()).getParameterNames();

        for (int i = 0; i < parameterNames.length; i++) {
            if ("userId".equals(parameterNames[i])) {
                return (Long) args[i];
            }
        }
        return null;
    }
}
