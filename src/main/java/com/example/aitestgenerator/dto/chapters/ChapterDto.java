package com.example.aitestgenerator.dto.chapters;

import com.example.aitestgenerator.models.Text;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import lombok.extern.jackson.Jacksonized;

@Data
@Jacksonized
@Builder
@ToString
public class ChapterDto {
    private Long id;
    private Long userId;
    private String title;
    private Text text;
    private Long testId;
}
