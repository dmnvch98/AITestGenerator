package com.example.aitestgenerator.controllers;

import com.example.aitestgenerator.config.security.service.PrincipalUser;
import com.example.aitestgenerator.facades.ChapterFacade;
import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.services.ChapterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chapters")
@RequiredArgsConstructor
public class ChapterController {
    private final ChapterService chapterService;
    private final ChapterFacade chapterFacade;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Chapter save(@RequestBody Chapter chapter, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return chapterService.save(chapter, userId);
    }

    @GetMapping
    public List<Chapter> findAllByUser(Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return chapterFacade.findAllByUser(userId);
    }

    @PutMapping
    public Chapter update(@RequestBody Chapter chapter, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return chapterFacade.update(chapter, userId);
    }

    @DeleteMapping("/{chapterId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long chapterId, Authentication authentication) {
        Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        chapterFacade.delete(chapterId, userId);
    }
}
