package com.example.aitestgenerator.utils;

import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.Text;
import lombok.experimental.UtilityClass;
import org.springframework.http.HttpStatus;

import java.util.List;


@UtilityClass
public class ExceptionBuilder {
    public static AppException getRequestedTextIdsNotFoundException(Long userId, List<Long> textIds, List<Text> foundUserTextIds) {
        return new AppException("Some texts not found or user does not have access. User id: " + userId
            + " Requested text ids: " + textIds
            + " Found user text ids: " + foundUserTextIds
            .stream()
            .map(Text::getId)
            .toList()
            , HttpStatus.NOT_FOUND);
    }

    public static void throwUserNotHaveTextsException(Long userId) {
        throw new AppException("User doesn't have saved texts. User Id: " + userId, HttpStatus.NOT_FOUND);
    }

    public static AppException getUserNotHaveTextsException(Long userId) {
        throw new AppException("User doesn't have saved texts. User Id: " + userId, HttpStatus.NOT_FOUND);
    }
}
