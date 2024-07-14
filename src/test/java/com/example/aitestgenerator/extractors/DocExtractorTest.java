package com.example.aitestgenerator.extractors;

import org.junit.jupiter.api.Test;

import java.net.URL;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class DocExtractorTest {

    @Test
    public void testExtractDocx() {
        DocExtractor extractor = new DocExtractor();
        URL fileUrl = getClass().getResource("/test.docx");

        String extractedText = extractor.extract(fileUrl);

        assertTrue(extractedText.contains("This is a test document for .docx"));
    }

    @Test
    public void testExtractDoc() {
        DocExtractor extractor = new DocExtractor();
        URL fileUrl = getClass().getResource("/test.doc");

        String extractedText = extractor.extract(fileUrl);

        assertTrue(extractedText.contains("This is a test document for .doc"));
    }
}
