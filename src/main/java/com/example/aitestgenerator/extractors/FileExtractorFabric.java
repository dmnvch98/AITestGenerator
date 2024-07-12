package com.example.aitestgenerator.extractors;

import org.springframework.stereotype.Component;

@Component
public class FileExtractorFabric {

    public FileExtractor getFileExtractor(final String fileExtension) {
        switch (fileExtension) {
           case "pdf" -> {
               return new PDFExtractor();
           }
           case "doc", "docx" -> {
               return new WordExtractor();
           }
        }
        return null;
    }
}
