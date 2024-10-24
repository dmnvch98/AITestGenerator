package com.example.generation_service.services;

import com.example.generation_service.models.Text;
import com.example.generation_service.repositories.TextRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static com.example.generation_service.utils.ExceptionBuilder.getRequestedTextIdsNotFoundException;
import static com.example.generation_service.utils.ExceptionBuilder.throwUserNotHaveTextsException;

@RequiredArgsConstructor
@Service
@Slf4j
public class TextService {
    private final TextRepository textRepository;

    public Text save(Text text) {
        log.debug("Saving text. Text title: {}. Text length : {}", text.getTitle(),
            text.getContent().length());

        return textRepository.save(text);
    }

    public List<Text> findAllByUserId(Long userId) {
        return textRepository.findAllByUserId(userId);
    }

    public List<Text> findAllByIdInAndUserId(List<Long> ids, Long userId) {
        return getUserTextsOrThrow(ids, userId);
    }

    public void delete(Long id, Long userId) {
        log.debug("Deleting text. Text id: {}. User id: {}", id, userId);
        Text existingText = findAllByIdAndUserIdOrThrow(id, userId);

        textRepository.delete(existingText);
    }

    public Text update(final Text text, final Long userId) {
        log.debug("Updating text.Text ID: {}", text.getId());

        findAllByIdAndUserIdOrThrow(text.getId(), userId);

        text.setUserId(userId);

        return textRepository.save(text);
    }

    public void deleteInBatch(List<Long> textIds, Long userId) {
        List<Text> existingUserTexts = getUserTextsOrThrow(textIds, userId);

        textRepository.deleteAll(existingUserTexts);
    }

    private List<Text> getUserTextsOrThrow(List<Long> textIds, Long userId) {
        List<Text> existingUserTexts = textRepository.findAllByIdInAndUserId(textIds, userId);

        if (existingUserTexts != null && existingUserTexts.size() != textIds.size()) {
            throw getRequestedTextIdsNotFoundException(userId, textIds, existingUserTexts);
        }

        if (existingUserTexts == null) {
            throwUserNotHaveTextsException(userId);
        }
        return existingUserTexts;
    }

    public Text findAllByIdAndUserIdOrThrow(final Long textId, final Long userId) {
        Text text = textRepository.findAllByIdAndUserId(textId, userId);
        if (text == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Text not found for user. Text Id: " + textId +
                ". User id: " + userId);
        }
        return text;
    }

}
