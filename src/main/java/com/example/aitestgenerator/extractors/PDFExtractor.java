package com.example.aitestgenerator.extractors;

import com.example.aitestgenerator.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

@Slf4j
public class PDFExtractor implements FileExtractor {

    @Override
    public String extract(final URL fileUrl) {
        try (InputStream inputStream = fileUrl.openStream();
             PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            return Utils.removeNewLines(pdfStripper.getText(document));
        } catch (IOException e) {
            log.error("Error when parsing PDF document", e);
            return null;
        }
    }
}
