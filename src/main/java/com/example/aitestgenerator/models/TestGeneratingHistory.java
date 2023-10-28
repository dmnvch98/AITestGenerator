package com.example.aitestgenerator.models;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TestGeneratingHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "id")
    private User user;
    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "testId", referencedColumnName = "id")
    private Test test;
    @ManyToOne
    @JoinColumn(name = "textId", referencedColumnName = "id")
    private Text text;
    private LocalDateTime generationStart;
    private LocalDateTime generationEnd;
    private Integer inputTokensCount;
    private Integer outputTokensCount;
    @Enumerated(EnumType.STRING)
    private GenerationStatus generationStatus;
}
