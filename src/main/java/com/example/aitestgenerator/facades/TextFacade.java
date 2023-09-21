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

    public Text save(Text text, Long userId) {
        text.setUserId(userId);

        return textService.save(text);
    }

    public List<TextResponseDto> findAllByUser(Long[] textIds, Long userId) {
        if (textIds!= null && textIds.length > 0) {
            return textService
                .findAllByIdInAndUserId(List.of(textIds), userId)
                .stream()
                .map(textConverter::mapTextToResponseDto)
                .collect(Collectors.toList());
        }
        return findAllByUserId(userId);
    }

    private List<TextResponseDto> findAllByUserId(Long userId) {
        return textService.findAllByUserId(userId)
            .stream()
            .map(textConverter::mapTextToResponseDto)
            .collect(Collectors.toList());
    }


    public void delete(Long id, Long userId) {
        textService.delete(id, userId);
    }

    public TextResponseDto update(Text text, Long userId) {
        return textConverter
            .mapTextToResponseDto(textService.update(text, userId));
    }

    public void deleteInBatch(List<Long> textIds, Long userId) {
        textService.deleteInBatch(textIds, userId);
    }

}
