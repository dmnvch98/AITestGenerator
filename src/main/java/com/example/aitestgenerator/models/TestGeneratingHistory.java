package com.example.aitestgenerator.models;

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
    private Long testId;
    private String testTitle;
    private LocalDateTime generationStart;
    private LocalDateTime generationEnd;
    @Enumerated(EnumType.STRING)
    private GenerationStatus generationStatus;
    private String failReason;
    private String messageReceipt;
    private String cid;
    private String fileName;

    @Override
    public String toString() {
        return "TestGeneratingHistory{" +
                "failReason=" + failReason +
                ", id=" + id +
                '}';
    }
}
