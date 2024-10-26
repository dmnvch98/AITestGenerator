package com.example.generation_service.exceptionHandler.enumaration;

import com.amazonaws.util.CollectionUtils;
import com.example.generation_service.exceptions.TestGenException;
import com.fasterxml.jackson.core.JsonParseException;
import com.theokanning.openai.OpenAiHttpException;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.io.FileNotFoundException;
import java.io.Serializable;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;
import java.util.*;
import java.util.concurrent.TimeoutException;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@AllArgsConstructor
@Getter
public enum GenerationFailReason implements Serializable {

    //1
    UNKNOWN(TestGenException.class, null, false, 1),
    //2
    SHUTDOWN_REQUESTED(TestGenException.class, null, true,2),
    //10000
    HTTP_EXCEPTION_UNAUTHORIZED(OpenAiHttpException.class, "Incorrect API key provided: .*", true, 1),
    HTTP_EXCEPTION_LIMIT_EXCEEDED(OpenAiHttpException.class,
          "You exceeded your current quota, please check your plan and billing details. .*", true, 2),
    REGION_NOT_SUPPORTED(OpenAiHttpException.class, "Country, region, or territory not supported.*", true, 3),
    REQUEST_TOO_LARGE(OpenAiHttpException.class, "Request too large .*", true, 4),
    //11000
    PARSE_EXCEPTION(JsonParseException.class, "Unexpected character: .*", true, 1),
    //12000
    FILE_NOT_FOUND(FileNotFoundException.class, "(http|https)://.*", true, 1),
    //13000
    SOCKET_TIMEOUT(SocketTimeoutException.class, "timeout.*", false, 1),
    //14000
    UNKNOWN_HOST_EXCEPTION(UnknownHostException.class, "api.openai.com: nodename nor servname provided, or not known.*", true, 1),
    TIMEOUT_EXCEPTION(TimeoutException.class, "Request timed out after.*", false, 1);

    private final Class<? extends Throwable> cause;
    private final String messageRegex;
    private final static Set<GenerationFailReason> failReasons = initializeFailsReasons();
    private final boolean fatal;
    private final int number;
    private static final Map<Class<?>, Integer> groupCodes = initializeGroupCodes();

    private static Map<Class<?>, Integer> initializeGroupCodes() {
        if (groupCodes!= null) {
            return groupCodes;
        }
        final Map<Class<?>, Integer> groupCodes = new HashMap<>();
        groupCodes.put(TestGenException.class, 0);
        groupCodes.put(OpenAiHttpException.class, 10000);
        groupCodes.put(JsonParseException.class, 11000);
        groupCodes.put(FileNotFoundException.class, 12000);
        groupCodes.put(SocketTimeoutException.class, 13000);
        groupCodes.put(UnknownHostException.class, 14000);
        groupCodes.put(TimeoutException.class, 15000);
        return groupCodes;
    }

    private static Set<GenerationFailReason> initializeFailsReasons() {
      if (CollectionUtils.isNullOrEmpty(failReasons)) {
        return Arrays.stream(GenerationFailReason.values())
           .filter(r -> r.cause != null)
           .collect(Collectors.toSet());
      }
      return failReasons;
    }

    public static GenerationFailReason extractFailureCode(final Throwable throwable) {
        Throwable current = throwable;
        while (current != null) {
            for (final GenerationFailReason code : failReasons) {
                if (code.getCause().isInstance(current)) {
                    final String message = current.getMessage();
                    if (message != null && Pattern.matches(code.getMessageRegex(), message)) {
                        return code;
                    }
                }
            }
            current = current.getCause();
        }
        return UNKNOWN;
    }

    public static int getFailCode(final GenerationFailReason failReason) {
        return Optional.of(failReason)
           .map(GenerationFailReason::getCause)
           .map(cause -> groupCodes.getOrDefault(cause, 1))
           .map(groupCode -> groupCode + failReason.getNumber())
           .orElse(1);
    }

    public static int getFailCode(final String failReason) {
        return Optional.ofNullable(failReason)
              .map(GenerationFailReason::valueOf)
              .map(GenerationFailReason::getFailCode)
              .orElse(1);
    }


}
