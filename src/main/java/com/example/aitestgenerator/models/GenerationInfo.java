package com.example.aitestgenerator.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@EqualsAndHashCode
@Entity
public class GenerationInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long historyId;
    private long userInputTokens;
    private long systemInputTokens;
    private long outputTokens;
    private LocalDateTime generationStart;
    private LocalDateTime generationEnd;
}