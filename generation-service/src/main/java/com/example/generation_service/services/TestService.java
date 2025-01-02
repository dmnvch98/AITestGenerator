package com.example.generation_service.services;

import com.example.generation_service.annotations.enumeration.ActionType;
import com.example.generation_service.annotations.useractions.TrackAction;
import com.example.generation_service.models.test.Test;
import com.example.generation_service.models.test.TestSearchVector;
import com.example.generation_service.repositories.test.TestRepository;
import com.example.generation_service.repositories.test.TestSearchVectorRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestService {

    private final TestRepository testRepository;
    private final TestSearchVectorRepository vectorRepository;

    public Test save(final Test test) {
//        if (CollectionUtils.isNotEmpty(test.getQuestions())) {
//            test.getQuestions().forEach(questionDto -> {
//                if (questionDto.getAnswerOptions().size() > 1) {
//                    Collections.shuffle(questionDto.getAnswerOptions());
//                }
//            });
//        }
        testRepository.save(test);
        vectorRepository.insertSearchVector(
                test.getId(),
                test.getFileName(),
                test.getTitle(),
                test.getLanguage()
        );
        log.info("New test saved, id=[{}]", test.getId());
        return test;
    }

    public Page<Test> findUserTests(final Long userId, final String search, final int page, final int size,
                                    final String sortBy, final String sortDirection) {
        try {
            final Sort.Direction direction = Sort.Direction.fromString(sortDirection);
            final Pageable pageable = PageRequest.of(page, size, direction, sortBy);
            final Specification<Test> spec = Specification.where((root, query, criteriaBuilder) -> {
                final Predicate userIdPredicate = criteriaBuilder.equal(root.get("userId"), userId);

                if (search == null || search.trim().isEmpty()) {
                    return userIdPredicate;
                }
                final Join<Test, TestSearchVector> searchVectorJoin = root.join("testSearchVectors");
                final String formattedSearch = search.trim().replaceAll("\\s+", " | ");
                final Predicate ftsPredicate = criteriaBuilder.equal(
                        criteriaBuilder.function("fts_search", Boolean.class,
                                searchVectorJoin.get("searchVector"),
                                criteriaBuilder.literal("russian"),
                                criteriaBuilder.concat(criteriaBuilder.literal(formattedSearch), criteriaBuilder.literal(":*"))
                        ),
                        true
                );

                return criteriaBuilder.and(userIdPredicate, ftsPredicate);
            });

            return testRepository.findAll(spec, pageable);
        } catch (final Exception e) {
            log.error("Cannot get user tests", e);
            throw new IllegalArgumentException("Cannot get user tests");
        }
    }

    public void deleteTest(Long testId) {
        testRepository.deleteTestById(testId);
    }

    public Test findAllByIdAndUserIdOrThrow(Long testId, Long userId) {
        return testRepository.findTestByIdAndUserId(testId, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, String.format("Test with Id %d not found for user with id: %d", testId, userId)));
    }

    public Optional<Test> findAllByIdAndUserId(Long testId, Long userId) {
        return testRepository.findTestByIdAndUserId(testId, userId);
    }

    @TrackAction(ActionType.CREATE_TEST)
    public Test insertTest(final Test test, final Long userId) {
        return testRepository.save(test);
    }

    @TrackAction(ActionType.UPDATE_TEST)
    public Test updateTest(final Test test, final Long userId) {
        return testRepository.save(test);
    }
}
