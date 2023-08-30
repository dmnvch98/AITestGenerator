package com.example.aitestgenerator.models;
import com.example.aitestgenerator.interfaces.CheckableForEmptiness;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "tests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Test implements CheckableForEmptiness {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    @JsonProperty("title")
    private String title;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    @JsonProperty("questions")
    private List<Question> questions;


    @Override
    @JsonIgnore
    public boolean isEmpty() {
        return id == null && user == null && title == null && (questions == null || questions.isEmpty());
    }

}
