package com.example.aitestgenerator.extractors;

import com.example.aitestgenerator.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.List;

@Slf4j
public class WordExtractor implements FileExtractor {

    @Override
    public String extract(final URL fileUrl) {
        StringBuilder text = new StringBuilder();

        try (InputStream fis = fileUrl.openStream();
             XWPFDocument document = new XWPFDocument(fis)) {

            List<XWPFParagraph> paragraphs = document.getParagraphs();
            for (XWPFParagraph para : paragraphs) {
                text.append(para.getText()).append("\n");
            }
        } catch (IOException e) {
            log.error("Error when parsing Word document", e);
        }

        return Utils.removeNewLines(text.toString());
    }
}
