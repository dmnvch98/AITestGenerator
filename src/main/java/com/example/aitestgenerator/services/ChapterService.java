package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.repositories.ChapterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChapterService {
    private final ChapterRepository chapterRepository;
    private final UserService userService;

    public Chapter save(Chapter chapter, Long userId) {
        log.info("Saving chapter. Chapter title: {}. Text length : {}", chapter.getTitle(),
            chapter.getText().getContent().length());

        User user = userService.findUserById(userId);
        chapter.setUser(user);

        return chapterRepository.save(chapter);
    }

    public Chapter update(Chapter chapter) {
        log.info("Updating chapter.Chapter ID: {}", chapter.getId());
        return chapterRepository.save(chapter);
    }
    public void delete(Chapter chapter) {
        log.info("Deleting chapter. Chapter ID: {}", chapter.getId());
        chapterRepository.delete(chapter);
    }
    public Chapter findAllById(Long id) {
        log.info("Finding chapter by ID: {}", id);
        return chapterRepository.findAllById(id);
    }

    public List<Chapter> findAllByUser(User user) {
        log.info("Finding all chapters for user. User ID: {}", user.getId());
        return chapterRepository.findAllByUser(user);
    }




}
