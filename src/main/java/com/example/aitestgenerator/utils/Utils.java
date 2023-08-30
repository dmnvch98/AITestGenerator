package com.example.aitestgenerator.utils;

import com.knuddels.jtokkit.Encodings;
import com.knuddels.jtokkit.api.Encoding;
import com.knuddels.jtokkit.api.EncodingRegistry;
import com.knuddels.jtokkit.api.ModelType;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@UtilityClass
@Slf4j
public class Utils {
    public static int countTokens(String text) {
        EncodingRegistry registry = Encodings.newDefaultEncodingRegistry();

        Encoding encoding = registry.getEncodingForModel(ModelType.GPT_3_5_TURBO_16K);

        return encoding.countTokens(text);
    }

    public static String readFileContents(String filePath) {
        try {
            return Files.readString(Path.of(filePath));
        } catch (IOException e) {
            log.error("An error occurred while reading the file: {}", e.getMessage());
        }
        return null;
    }
}
