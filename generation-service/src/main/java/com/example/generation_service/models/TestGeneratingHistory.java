package com.example.generation_service.models;

import com.example.generation_service.converters.ormConverter.GenerateTestRequestConverter;
import com.example.generation_service.dto.tests.GenerateTestRequestDto;
import com.example.generation_service.models.enums.ActivityStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer;

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
    private Long userId;
    private Long testId;
    private String testTitle;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Enumerated(EnumType.STRING)
    private ActivityStatus status;
    private String failReason;
    private String cid;
    private String fileName;

    @Convert(converter = GenerateTestRequestConverter.class)
    @Column(name = "requestDto", columnDefinition = "jsonb")
    @ColumnTransformer(write = "?::jsonb")
    private GenerateTestRequestDto requestDto;

}
