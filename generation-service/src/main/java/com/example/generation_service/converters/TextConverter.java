package com.example.generation_service.converters;

import com.example.generation_service.dto.texts.TextRequestDto;
import com.example.generation_service.dto.texts.TextResponseDto;
import com.example.generation_service.models.Text;
import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;


@Mapper(componentModel = "spring")
@Component
public abstract class TextConverter {

    public abstract TextResponseDto mapTextToResponseDto(Text text);

    public abstract Text convert(final TextRequestDto requestDto, final long userId);

}
