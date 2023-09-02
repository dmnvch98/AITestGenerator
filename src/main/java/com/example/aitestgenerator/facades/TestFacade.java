package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.dto.tests.GenerateTestRequestDto;
import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.ChapterService;
import com.example.aitestgenerator.services.TestService;
import com.example.aitestgenerator.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class TestFacade {
    private final TestService testService;
    private final UserService userService;
    private final ChapterService chapterService;

    public Test generateTestAndSave(Long userId, GenerateTestRequestDto dto) throws JsonProcessingException {
        User user = userService.findUserById(userId);
        Chapter chapter = chapterService.findAllById(dto.getChapterId());

        if (user.getId().equals(chapter.getUser().getId())) {
            Test test = testService.generateTest(chapter, dto.getMinQuestionNumber(), dto.getMaxQuestionNumber());
            test.setUser(user);
            return testService.saveTest(test);
        }
        throw new AppException("Not allowed", HttpStatus.FORBIDDEN);
    }

    public void deleteTest(Long testId, Long userId) {
        User user = userService.findUserById(userId);
        Test test = testService.findTestByIdAndUser(testId, user);
        if (test != null) {
            testService.deleteTest(test);
        } else {
            throw new AppException("Test not found", HttpStatus.NOT_FOUND);
        }
    }

    public List<Test> findAllByUser(Long userId) {
        User user = userService.findUserById(userId);
        return testService.findAllByUser(user);
    }

    public Test findTestById(Long testId) {
        return testService.findTestById(testId);
    }
}
