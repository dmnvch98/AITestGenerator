package com.example.generation_service.models.files;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "file_search_vectors")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FileSearchVector {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "file_metadata_id", insertable = false, updatable = false)
    private FileMetadata fileMetadata;

    @Column(name = "search_vector", columnDefinition = "tsvector")
    private Object searchVector;

    @Column(name = "language", length = 50)
    private String language;
}
