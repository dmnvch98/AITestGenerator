package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.services.ChapterService;
import com.example.aitestgenerator.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ChapterFacade {
    private final ChapterService chapterService;
    private final UserService userService;

    public List<Chapter> findAllByUser(Long[] chapterIds, Long userId) {
        User user = userService.findUserById(userId);

        if (chapterIds == null || chapterIds.length == 0) {
            return chapterService.findAllByUser(user);
        }

        List<Chapter> existingUserChapters = chapterService.findByIdInAndUser(Arrays.asList(chapterIds), user);

        if (existingUserChapters.size() != chapterIds.length) {
            throw new AppException("Some chapters not found or user does not have access", HttpStatus.NOT_FOUND);
        }

        return existingUserChapters;
    }


    public void delete(Long id, Long userId) {
        Chapter existingChapter = getUserChapter(id, userId);

        chapterService.delete(existingChapter);
    }

    public Chapter update(Chapter updatedChapter, Long userId) {
        Chapter existingChapter = getUserChapter(updatedChapter.getId(), userId);

        updatedChapter.setUser(existingChapter.getUser());
        return chapterService.update(updatedChapter);
    }

    public void deleteInBatch(List<Long> chapterIds, Long userId) {
        User user = userService.findUserById(userId);

        List<Chapter> existingUserChapter = chapterService.findByIdInAndUser(chapterIds, user);

        if (existingUserChapter.size() == chapterIds.size()) {
            chapterService.deleteInBatch(existingUserChapter);
        } else {
            throw new AppException("Some chapters not found or user does not have access", HttpStatus.NOT_FOUND);
        }
    }

    public Chapter getUserChapter(Long chapterId, Long userId) {
        Chapter existingChapter = chapterService.findAllById(chapterId);

        if (existingChapter != null && existingChapter.getUser().getId().equals(userId)) {
            return existingChapter;
        } else {
            throw new AppException("Chapter not found or user does not have access", HttpStatus.NOT_FOUND);
        }
    }

}
