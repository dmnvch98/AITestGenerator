package com.example.aitestgenerator.models;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "tests")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "text_id")
    private Long textId;

    @Column(name = "title")
    private String title;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private List<Question> questions;
}
