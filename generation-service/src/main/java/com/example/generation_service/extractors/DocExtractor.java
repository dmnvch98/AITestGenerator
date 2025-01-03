package com.example.generation_service.extractors;

import com.example.generation_service.utils.Utils;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

@Slf4j
public class DocExtractor implements FileExtractor {

  @Override
  public String extract(final URL fileUrl) {
    StringBuilder text = new StringBuilder();

    try (InputStream fis = fileUrl.openStream()) {
      try (HWPFDocument document = new HWPFDocument(fis)) {
        WordExtractor extractor = new WordExtractor(document);
        text.append(extractor.getText());
      }
    } catch (IOException e) {
      throw new IllegalArgumentException("Error when parsing .doc document. File url: " + fileUrl.getPath(), e);
    }

    return Utils.removeNewLines(text.toString());
  }

  @Override
  public String extract(InputStream inputStream) throws IOException {

    final HWPFDocument document = new HWPFDocument(inputStream);
    WordExtractor extractor = new WordExtractor(document);

    return Utils.removeNewLines(String.valueOf(extractor.getText()));
  }
}
