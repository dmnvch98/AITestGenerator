package com.example.aitestgenerator.facades;

import com.example.aitestgenerator.converters.TextConverter;
import com.example.aitestgenerator.dto.texts.TextResponseDto;
import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.services.TextService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Component
public class TextFacade {

    private final TextService textService;
    private final TextConverter textConverter;

    public Text save(final Text text, final Long userId) {
        text.setUserId(userId);

        return textService.save(text);
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

    public TextResponseDto update(final Text text, final Long userId) {
        return textConverter
            .mapTextToResponseDto(textService.update(text, userId));
    }

    public void deleteInBatch(final List<Long> textIds, final Long userId) {
        textService.deleteInBatch(textIds, userId);
    }

}
