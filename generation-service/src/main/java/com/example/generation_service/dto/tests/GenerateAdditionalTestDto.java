package com.example.generation_service.dto.tests;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GenerateAdditionalTestDto {
    private String title;
    private List<QuestionDto> questions;

}
