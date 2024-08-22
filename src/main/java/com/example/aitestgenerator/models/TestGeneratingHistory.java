package com.example.aitestgenerator.models;

import com.example.aitestgenerator.exceptionHandler.enumaration.GenerationFailReason;
import com.example.aitestgenerator.models.enums.GenerationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Builder(toBuilder = true)
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
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "testId", referencedColumnName = "id")
    private Test test;
    private LocalDateTime generationStart;
    private LocalDateTime generationEnd;
    @Enumerated(EnumType.STRING)
    private GenerationStatus generationStatus;
    @Enumerated(EnumType.STRING)
    private GenerationFailReason failReason;
    private String messageReceipt;

    @Override
    public String toString() {
        return "TestGeneratingHistory{" +
                "failReason=" + failReason +
                ", id=" + id +
                '}';
    }
}
