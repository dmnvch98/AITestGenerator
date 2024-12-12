package com.example.generation_service.models.test;

import com.example.generation_service.converters.ormConverter.QuestionsConverter;
import com.example.generation_service.dto.tests.QuestionDto;
import com.example.generation_service.models.generation.TestQuestionsType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.annotations.ColumnTransformer;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tests", indexes = {
        @Index(name = "idx_created_at", columnList = "createdAt")
})
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Jacksonized
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;
    @Column(name = "file_name", columnDefinition = "TEXT")
    private String fileName;

    private String problems;

    @Column(name = "title", columnDefinition = "TEXT")
    private String title;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "language")
    private String language;

    @Convert(converter = QuestionsConverter.class)
    @Column(name = "questions", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private List<QuestionDto> questions;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<TestSearchVector> testSearchVectors;

    @Enumerated(EnumType.STRING)
    private TestQuestionsType questionsType;
}
