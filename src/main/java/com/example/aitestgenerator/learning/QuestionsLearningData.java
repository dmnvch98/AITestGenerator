package com.example.aitestgenerator.learning;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "question_learn_model")
public class QuestionsLearningData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "text", columnDefinition = "TEXT")
    private String text;
    @Column(name = "questions", columnDefinition = "TEXT")
    private String questions;
    @Column(name = "problems")
    private String problems;
    @Column(name = "max_questions")
    private Integer maxQuestions;

}
