package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.chapters.ChapterDto;
import com.example.aitestgenerator.exceptions.AppException;
import com.example.aitestgenerator.facades.TestFacade;
import com.example.aitestgenerator.facades.UserFacade;
import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Mapper(componentModel = "spring")
@Component
public abstract class ChapterConverter {
    @Autowired
    private TestFacade testFacade;

    @Autowired
    private UserFacade userFacade;

    @Mapping(target = "testId", source = "test.id" )
    @Mapping(target = "userId", source = "user.id" )
    abstract ChapterDto chapterToDto(Chapter chapter);

    @Mapping(target = "test", source = "testId", qualifiedByName = "findTestById")
    @Mapping(target = "user", source = "userId", qualifiedByName = "findUserById")
    abstract Chapter chapterDtoToChapter(ChapterDto chapterDto);

    @Named(value = "findTestById")
    Test findTestById(Long testId) {
        return testId != null
            ? testFacade.findTestById(testId)
            : null;
    }

    @Named(value = "findUserById")
    User findUserById(Long userId) {
        if (userId != null) {
            return userFacade.findUserById(userId);
        }
        throw new AppException("userId is a mandatory field", HttpStatus.BAD_REQUEST);
    }
}
