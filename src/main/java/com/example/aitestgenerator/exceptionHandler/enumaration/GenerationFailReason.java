package com.example.aitestgenerator.exceptionHandler.enumaration;

import com.amazonaws.util.CollectionUtils;
import com.fasterxml.jackson.core.JsonParseException;
import com.theokanning.openai.OpenAiHttpException;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@AllArgsConstructor
@Getter
public enum GenerationFailReason {

    HTTP_EXCEPTION_UNAUTHORIZED(OpenAiHttpException.class, "Incorrect API key provided: .*"),
    SHUTDOWN_REQUESTED(null, null),
    PARSE_EXCEPTION(JsonParseException.class, "Unexpected character: .*"),
    HTTP_EXCEPTION_LIMIT_EXCEEDED(OpenAiHttpException.class,
            "You exceeded your current quota, please check your plan and billing details. .*"),
    UNKNOWN(null, null);

    private final Class<? extends Throwable> cause;
    private final String messageRegex;
    private final static Set<GenerationFailReason> failReasons = initializeFailsReasons();

    private static Set<GenerationFailReason> initializeFailsReasons() {
      if (CollectionUtils.isNullOrEmpty(failReasons)) {
        return Arrays.stream(GenerationFailReason.values())
           .filter(r -> r.cause != null)
           .collect(Collectors.toSet());
      }
      return failReasons;
    }

    public static GenerationFailReason extractFailureCode(final Throwable throwable) {
        for (final GenerationFailReason code : failReasons) {
            if (code.getCause().isInstance(throwable)) {
                final String message = throwable.getMessage();
                if (message != null && Pattern.matches(code.getMessageRegex(), message)) {
                    return code;
                }
            }
        }
        return UNKNOWN;
    }
}
