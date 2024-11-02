package com.example.generation_service.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_search_vectors")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TestSearchVector {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @Column(columnDefinition = "TEXT")
    private String fileName;

    @Column(name = "search_vector", columnDefinition = "tsvector")
    private String searchVector;

}
