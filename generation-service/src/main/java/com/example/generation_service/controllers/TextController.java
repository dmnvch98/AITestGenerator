package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.texts.TextRequestDto;
import com.example.generation_service.dto.texts.TextResponseDto;
import com.example.generation_service.facades.TextFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/texts/")
@RequiredArgsConstructor
public class TextController {

    private final TextFacade textFacade;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TextResponseDto save(@RequestBody final TextRequestDto text, final Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return textFacade.save(text, userId);
    }

    @GetMapping
    public List<TextResponseDto> findAllByUser(@RequestParam(value = "ids", required = false) Long[] ids, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return textFacade.findAllByUser(ids, userId);
    }

    @PutMapping
    public TextResponseDto update(@RequestBody TextRequestDto text, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return textFacade.update(text, userId);
    }

    @DeleteMapping("/{chapterId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long chapterId, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        textFacade.delete(chapterId, userId);
    }

    @PatchMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteInBatch(@RequestBody List<Long> ids, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        textFacade.deleteInBatch(ids, userId);
    }
}
