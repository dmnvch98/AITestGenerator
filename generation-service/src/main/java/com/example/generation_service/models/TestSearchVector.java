package com.example.generation_service.models;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "test_search_vectors")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestSearchVector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", insertable = false, updatable = false)
    private Test test;

    @Column(name = "test_id", nullable = false)
    private Long testId;

    @Column(name = "search_vector", columnDefinition = "tsvector")
    private String searchVector;

    @Column(name = "language", length = 50)
    private String language;
}
