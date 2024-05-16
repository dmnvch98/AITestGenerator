package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.texts.TextRequestDto;
import com.example.aitestgenerator.dto.texts.TextResponseDto;
import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.repositories.TestRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;


@Mapper(componentModel = "spring")
@Component
public abstract class TextConverter {

    @Autowired
    private TestRepository testRepository;

    @Mapping(source = "id", target = "testIds", qualifiedByName = "findTestsByTextId")
    public abstract TextResponseDto mapTextToResponseDto(Text text);

    public abstract Text convert(final TextRequestDto requestDto, final long userId);

    @Named("findTestsByTextId")
    public List<Long> findTestsByTextId(Long textId) {
        List<Test> list = testRepository.findAllByTextId(textId);

        return !list.isEmpty()
            ? list.stream()
            .map(Test::getId)
            .toList()
            : null;
    }

}
