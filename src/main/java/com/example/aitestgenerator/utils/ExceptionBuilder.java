package com.example.aitestgenerator.utils;

import com.example.aitestgenerator.models.Text;
import lombok.experimental.UtilityClass;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@UtilityClass
public class ExceptionBuilder {
    public static ResponseStatusException getRequestedTextIdsNotFoundException(Long userId, List<Long> textIds, List<Text> foundUserTextIds) {
        String message = "Some texts not found or user does not have access. User id: " + userId
            + " Requested text ids: " + textIds
            + " Found user text ids: " + foundUserTextIds
            .stream()
            .map(Text::getId)
            .map(String::valueOf)
            .collect(Collectors.joining(", "));

        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }

    public static void throwUserNotHaveTextsException(Long userId) {
        String message = "User doesn't have saved texts. User Id: " + userId;
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }

}
