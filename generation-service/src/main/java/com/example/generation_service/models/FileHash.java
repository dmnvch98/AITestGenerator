package com.example.generation_service.models;

import java.time.LocalDateTime;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "file_hashes")
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

    @Column(name = "tokensCount")
    @JsonIgnore
    private Integer tokensCount;

}
