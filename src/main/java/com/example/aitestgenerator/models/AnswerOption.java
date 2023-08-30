package com.example.aitestgenerator.models;
import com.example.aitestgenerator.interfaces.CheckableForEmptiness;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "answer_options")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerOption implements CheckableForEmptiness {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_id")
    @JsonIgnore
    private Question question;

    @Column(name = "option_text")
    @JsonProperty("optionText")
    private String optionText;

    @Column(name = "is_correct")
    @JsonProperty("isCorrect")
    private Boolean isCorrect;

    @Override
    @JsonIgnore
    public boolean isEmpty() {
        return id == null && question == null && optionText == null && isCorrect == null;
    }
}
