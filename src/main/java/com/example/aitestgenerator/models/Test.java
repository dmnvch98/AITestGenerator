package com.example.aitestgenerator.models;

import com.example.aitestgenerator.converters.JsonConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;
import org.hibernate.annotations.ColumnTransformer;

import java.util.Set;

@Entity
@Table(name = "tests")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Jacksonized
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    private String fileName;

    private String problems;

    @Column(name = "title")
    private String title;

    @Convert(converter = JsonConverter.class)
    @Column(name = "questions", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private JsonNode questions;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<TestResult> testResults;
}
