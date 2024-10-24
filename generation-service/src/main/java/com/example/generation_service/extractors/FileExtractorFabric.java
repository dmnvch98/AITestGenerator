package com.example.generation_service.extractors;

import org.springframework.stereotype.Component;

@Component
public class FileExtractorFabric {

    public FileExtractor getFileExtractor(final String fileExtension) {
        switch (fileExtension) {
            case "pdf" -> {
                return new PDFExtractor();
            }
            case "docx" -> {
                return new DocxExtractor();
            }
            case "doc" -> {
                return new DocExtractor();
            }
        }
        return null;
    }
}
