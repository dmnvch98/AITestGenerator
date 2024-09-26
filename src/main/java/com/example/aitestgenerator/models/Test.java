package com.example.aitestgenerator.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.extern.jackson.Jacksonized;

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

//    @ManyToOne
//    @JoinColumn(name = "file_hash_id")
//    private FileHash fileHash;

    private String fileName;

    private String problems;

    @Column(name = "title")
    private String title;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Question> questions;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<TestGeneratingHistory> testGeneratingHistories;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<TestResult> testResults;
}
