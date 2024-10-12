package com.example.aitestgenerator.models;

import com.example.aitestgenerator.converters.ormConverter.QuestionsConverter;
import com.example.aitestgenerator.dto.tests.QuestionDto;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.annotations.ColumnTransformer;

import java.util.List;

@Entity
@Table(name = "tests")
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

    private String fileName;

    private String problems;

    @Column(name = "title")
    private String title;

    @Convert(converter = QuestionsConverter.class)
    @Column(name = "questions", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private List<QuestionDto> questions;

//    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
//    @JsonIgnore
//    private Set<TestResult> testResults;
}
