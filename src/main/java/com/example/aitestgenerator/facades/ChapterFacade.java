package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.ChapterService;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ChapterFacade {
    private final ChapterService chapterService;
    private final UserService userService;

    public List<Chapter> findAllByUser(Long userId) {
        User user = userService.findUserById(userId);
        return chapterService.findAllByUser(user);
    }

    public void delete(Long id, Long userId) {
        Chapter existingChapter = getExistingChapterOrThrow(id, userId);

        chapterService.delete(existingChapter);
    }

    public Chapter update(Chapter updatedChapter, Long userId) {
        Chapter existingChapter = getExistingChapterOrThrow(updatedChapter.getId(), userId);

        updatedChapter.setUser(existingChapter.getUser());
        return chapterService.update(updatedChapter);
    }

    private Chapter getExistingChapterOrThrow(Long chapterId, Long userId) {
        Chapter existingChapter = chapterService.findAllById(chapterId);

        if (existingChapter != null && existingChapter.getUser().getId().equals(userId)) {
            return existingChapter;
        } else {
            throw new AppException("Chapter not found or user does not have access", HttpStatus.NOT_FOUND);
        }
    }

}
