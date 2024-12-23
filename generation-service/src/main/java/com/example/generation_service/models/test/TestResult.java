package com.example.generation_service.models.test;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer;

import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "user_id")
    private Long userId;
    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "testId", referencedColumnName = "id")
    private Test test;
    @Column(name = "data", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private String data;
    private LocalDateTime testPassedTime;
    private String testTitle;
}
