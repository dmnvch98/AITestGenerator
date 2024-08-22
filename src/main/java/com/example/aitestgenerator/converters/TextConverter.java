package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.texts.TextRequestDto;
import com.example.aitestgenerator.dto.texts.TextResponseDto;
import com.example.aitestgenerator.models.Text;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;


@Mapper(componentModel = "spring")
@Component
public abstract class TextConverter {

    public abstract TextResponseDto mapTextToResponseDto(Text text);

    public abstract Text convert(final TextRequestDto requestDto, final long userId);

}
