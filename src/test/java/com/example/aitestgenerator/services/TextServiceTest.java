package com.example.aitestgenerator.services;

import com.example.aitestgenerator.models.Text;
import com.example.aitestgenerator.repositories.TextRepository;

import org.junit.Ignore;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Set;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@Ignore
@Disabled
public class TextServiceTest {

    @Mock
    private TextRepository textRepository;

    @InjectMocks
    private TextService textService;

    private final Long userId = 1L;

    private final Text defaultText1 = new Text(1L, userId, "Text 1", "Content 1", Set.of());
    private final Text defaultText2 = new Text(2L, userId, "Text 2", "Content 2", Set.of());


    @Test
    void save_ValidText_ReturnsSavedText() {
        Long userId = 1L;
        Text textToSave = Text.builder()
            .content("Content")
            .title("Title")
            .build();

        Text expectedText = Text.builder()
            .content("Content")
            .title("Title")
            .userId(userId)
            .build();

        when(textService.save(textToSave)).thenReturn(expectedText);

        Text savedText = textService.save(textToSave);

        verify(textRepository, times(1)).save(textToSave);

        assertEquals(expectedText, savedText);
    }

    @Test
    void findAllByUserId_NullIds_ReturnsAllTextsForUser() {
        Long userId = 1L;

        List<Text> userTexts = Arrays.asList(
            defaultText1,
            defaultText2
        );

        when(textRepository.findAllByUserId(userId)).thenReturn(userTexts);



        List<Text> result = textService.findAllByUserId(userId);

        verify(textRepository, times(1)).findAllByUserId(userId);

        assertEquals(userTexts, result);
    }

    @Test
    void findAllByUserId_ValidIds_ReturnsSelectedTextsForUser() {
        Long userId = 1L;

        List<Text> userTexts = Arrays.asList(
            defaultText1,
            defaultText2
        );

        when(textRepository.findAllByIdInAndUserId(Arrays.asList(1L, 2L), userId)).thenReturn(userTexts);

        List<Text> result = textService.findAllByIdInAndUserId(Arrays.asList(1L, 2L), userId);

        verify(textRepository, times(1)).findAllByIdInAndUserId(Arrays.asList(1L, 2L), userId);

        assertEquals(userTexts, result);
    }

    @Test
    void findAllByUserId_InvalidIds_ThrowsException() {
        when(textRepository.findAllByIdInAndUserId(Arrays.asList(1L, 2L), userId)).thenReturn(null);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            textService.findAllByIdInAndUserId(Arrays.asList(1L, 2L), userId);
        });

        assertEquals("User doesn't have saved texts. User Id: 1", exception.getMessage());
    }

    @Test
    void findAllByUserId_NotAllValidIds_ThrowsException() {
        Long userId = 1L;

        List<Text> userTexts = Arrays.asList(
            defaultText1,
            defaultText2
        );

        when(textRepository.findAllByIdInAndUserId(Arrays.asList(1L, 3L), userId)).thenReturn(List.of(userTexts.get(0)));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            textService.findAllByIdInAndUserId(Arrays.asList(1L, 3L), userId);
        });

        assertEquals("Some texts not found or user does not have access. User id: 1 Requested text ids: [1, 3] " +
            "Found user text ids: [1]", exception.getMessage());
    }

    @Test
    void delete_ValidTextId_DeletesTheText() {
        Long textId = defaultText1.getId();

        when(textRepository.findAllByIdAndUserId(textId, userId)).thenReturn(defaultText1);

        textService.delete(textId, userId);

        verify(textRepository, times(1)).delete(any());
    }

    @Test
    void delete_InvalidTextId_ThrowsException() {
        Long textId = defaultText1.getId();

        when(textRepository.findAllByIdAndUserId(textId, userId)).thenReturn(null);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            textService.delete(textId, userId);
        });

        assertEquals("Text not found for user. Text Id: 1. User id: 1", exception.getMessage());

        verify(textRepository, never()).delete(any());
    }

    @Test
    void update_ValidText_UpdatesTheText() {
        when(textRepository.findAllByIdAndUserId(defaultText1.getId(), userId)).thenReturn(defaultText1);

        textService.update(defaultText1, userId);

        verify(textRepository, times(1)).save(defaultText1);
    }

    @Test
    void update_InvalidText_ThrowsException() {

        when(textRepository.findAllByIdAndUserId(defaultText1.getId(), userId)).thenReturn(null);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            textService.update(defaultText1, userId);
        });

        assertEquals("Text not found for user. Text Id: 1. User id: 1", exception.getMessage());

        verify(textRepository, never()).save(defaultText1);
    }

    @Test
    void deleteInBatch_ValidTextIds_DeletesTheTextsInBatch() {
        List<Long> textIds = List.of(1L, 2L);

        List<Text> textsToDelete = List.of(defaultText1, defaultText2);

        when(textRepository.findAllByIdInAndUserId(textIds, userId)).thenReturn(textsToDelete);

        textService.deleteInBatch(textIds, userId);

        verify(textRepository, times(1)).deleteAll(textsToDelete);
    }

    @Test
    void deleteInBatch_InvalidTextIds_ThrowsException() {
        List<Long> textIds = List.of(1L, 2L);

        when(textRepository.findAllByIdInAndUserId(textIds, userId)).thenReturn(List.of(defaultText1));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            textService.deleteInBatch(textIds, userId);
        });

        assertEquals("Some texts not found or user does not have access. User id: 1 Requested text ids: [1, 2] Found user text ids: [1]", exception.getMessage());

        verify(textRepository, never()).deleteAll(anyList());
    }

    @Test
    void deleteInBatch_UserNotHaveTexts_ThrowsException() {
        List<Long> textIds = List.of(1L, 2L);

        when(textRepository.findAllByIdInAndUserId(textIds, userId)).thenReturn(null);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            textService.deleteInBatch(textIds, userId);
        });

        assertEquals("User doesn't have saved texts. User Id: 1", exception.getMessage());

        verify(textRepository, never()).deleteAll(anyList());
    }
}
