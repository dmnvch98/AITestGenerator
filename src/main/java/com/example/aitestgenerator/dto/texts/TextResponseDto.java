package com.example.aitestgenerator.dto.texts;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TextResponseDto {
    private Long id;
    private Long userId;
    private List<Long> testIds;
    private String title;
    private String content;
}
