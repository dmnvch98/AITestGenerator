package com.example.aitestgenerator.exceptionHandler.enumaration;

import com.fasterxml.jackson.core.JsonParseException;
import com.theokanning.openai.OpenAiHttpException;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.regex.Pattern;

@AllArgsConstructor
@Getter
public enum GenerationFailReason {

    HTTP_EXCEPTION_UNAUTHORIZED(OpenAiHttpException.class, "Incorrect API key provided: .*"),
    SHUTDOWN_REQUESTED(null, null),
    PARSE_EXCEPTION(JsonParseException.class, "Unexpected character: .*"),
    UNKNOWN(null, null);

    private final Class<? extends Throwable> cause;
    private final String messageRegex;

    public static GenerationFailReason extractFailureCode(final Throwable throwable) {
        for (final GenerationFailReason code : GenerationFailReason.values()) {
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
