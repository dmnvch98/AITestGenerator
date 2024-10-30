package com.example.generation_service.extractors;

import com.example.generation_service.utils.Utils;
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
      throw new IllegalArgumentException("Error when parsing PDF document. File url: " + fileUrl.getPath(), e);

    }
  }

  @Override
  public String extract(InputStream inputStream) throws IOException {
      try (PDDocument document = PDDocument.load(inputStream)) {
          PDFTextStripper pdfStripper = new PDFTextStripper();
          return Utils.removeNewLines(pdfStripper.getText(document));
      }
  }

}
