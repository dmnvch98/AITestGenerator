package com.example.generation_service.extractors;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

public interface FileExtractor {

    String extract(final URL fileUrl);

    String extract(final InputStream inputStream) throws IOException;
}
