package com.example.generation_service.facades;

import com.example.generation_service.converters.TextConverter;
import com.example.generation_service.dto.texts.TextRequestDto;
import com.example.generation_service.dto.texts.TextResponseDto;
import com.example.generation_service.models.Text;
import com.example.generation_service.services.TextService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Component
public class TextFacade {

    private final TextService textService;
    private final TextConverter textConverter;

    public TextResponseDto save(final TextRequestDto requestDto, final Long userId) {
        final Text text = textConverter.convert(requestDto, userId);

        textService.save(text);

        return textConverter.mapTextToResponseDto(text);
    }

    public List<TextResponseDto> findAllByUser(final Long[] textIds, final Long userId) {
        if (textIds!= null && textIds.length > 0) {
            return textService
                .findAllByIdInAndUserId(List.of(textIds), userId)
                .stream()
                .map(textConverter::mapTextToResponseDto)
                .collect(Collectors.toList());
        }
        return findAllByUserId(userId);
    }

    private List<TextResponseDto> findAllByUserId(final Long userId) {
        return textService.findAllByUserId(userId)
            .stream()
            .map(textConverter::mapTextToResponseDto)
            .collect(Collectors.toList());
    }


    public void delete(final Long id, final Long userId) {
        textService.delete(id, userId);
    }

    public TextResponseDto update(final TextRequestDto requestDto, final Long userId) {
        Text existingText = textService.findAllByIdAndUserIdOrThrow(requestDto.getId(), userId);
        existingText.setContent(requestDto.getContent());
        existingText.setTitle(requestDto.getTitle());
        textService.update(existingText, userId);
        return textConverter.mapTextToResponseDto(existingText);
    }

    public void deleteInBatch(final List<Long> textIds, final Long userId) {
        textService.deleteInBatch(textIds, userId);
    }

}
