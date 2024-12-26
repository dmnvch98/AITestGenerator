package com.example.generation_service.models.files;

import java.time.LocalDateTime;
import java.util.List;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "file_hashes",
        indexes = {
                @Index(name = "idx_hashed_filename_user_id", columnList = "hashed_filename, user_id"),
                @Index(name = "idx_original_filename_user_id", columnList = "original_filename, user_id")
        }
)
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FileHash {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "hashed_filename", nullable = false)
    private String hashedFilename;

    @Column(name = "upload_time", nullable = false)
    private LocalDateTime uploadTime;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "data")
    @JsonIgnore
    private String data;

    @Column(name = "copies_num")
    @Builder.Default
    private Integer copiesNum = 0;

    @OneToMany(mappedBy = "fileHash", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<FileSearchVector> fileSearchVectors;

    public void incrementCopiesNum() {
        copiesNum++;
    }
}
