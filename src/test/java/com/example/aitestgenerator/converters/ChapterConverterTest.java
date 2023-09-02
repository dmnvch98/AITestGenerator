package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.chapters.ChapterDto;
import com.example.aitestgenerator.facades.ChapterFacade;
import com.example.aitestgenerator.facades.UserFacade;
import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ChapterConverterTest {

    @Autowired
    private ChapterConverter chapterConverter;

    @Autowired
    private UserFacade userFacade;

    @Autowired
    private ChapterFacade chapterFacade;
    @Test
    void chapterToDto() {
        Chapter chapter = chapterFacade.getUserChapter(1L,1L);
        ChapterDto chapterDto = chapterConverter.chapterToDto(chapter);
        Chapter convertedChapter = chapterConverter.chapterDtoToChapter(chapterDto);
    }

    @Test
    void chapterDtoToChapter() {
    }
}