package com.example.generation_service.controllers;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.tests.TestRatingDto;
import com.example.generation_service.facades.TestRatingFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tests/{testId}/ratings")
@RequiredArgsConstructor
public class TestRatingController {

    private final TestRatingFacade facade;

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TestRatingDto upsertRating(
          final Authentication authentication,
          @PathVariable Long testId,
          @RequestBody final TestRatingDto rating
    ) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return facade.saveRating(rating, testId, userId);
    }

    @GetMapping
    public TestRatingDto getRating(
          final Authentication authentication,
          @PathVariable Long testId
    ) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return facade.getRating(testId, userId);
    }
}
