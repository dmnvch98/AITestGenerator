package com.example.aitestgenerator.models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.util.List;


@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_id")
    @JsonIgnore
    private Test test;

    @Column(nullable = false)
    @JsonProperty("questionText")
    private String questionText;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    @JsonProperty("answerOptions")
    private List<AnswerOption> answerOptions;

}
