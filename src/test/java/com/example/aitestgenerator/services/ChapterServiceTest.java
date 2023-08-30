package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.models.User;
import com.example.aitestgenerator.repositories.ChapterRepository;
import com.example.aitestgenerator.repositories.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;


@SpringBootTest
@Disabled
class ChapterServiceTest {

    @Autowired
    ChapterRepository chapterRepository;
    @Autowired
    UserRepository userRepository;

    @Test
    void saveChapter() {
        User user = User.builder()
            .password("passwoкd")
            .firstName("first name")
            .lastName("last name")
            .email("email")
            .build();

        User user1 = userRepository.save(user);

        Text text = Text.builder()
            .content("Content 1")
            .build();

        Chapter chapter = Chapter.builder()
            .title("Main Chapter")
            .text(text)
            .user(user1)
            .build();
        chapterRepository.save(chapter);

    }

}