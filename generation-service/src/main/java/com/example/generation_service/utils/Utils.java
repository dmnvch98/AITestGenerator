package com.example.generation_service.utils;

import com.knuddels.jtokkit.Encodings;
import com.knuddels.jtokkit.api.Encoding;
import com.knuddels.jtokkit.api.EncodingRegistry;
import com.knuddels.jtokkit.api.ModelType;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.ThreadLocalRandom;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@UtilityClass
@Slf4j
public class Utils {
    public static int countTokens(String text) {
        EncodingRegistry registry = Encodings.newDefaultEncodingRegistry();

        Encoding encoding = registry.getEncodingForModel(ModelType.GPT_4O_MINI);

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

    public static String getExportedTestName(String testName, String fileFormat) {
        String truncatedName = testName.length() > 15 ? testName.substring(0, 15) : testName;
        return URLEncoder.encode(truncatedName, StandardCharsets.UTF_8) + '.' + fileFormat.toLowerCase();
    }

    public static String removeNewLines(final String text) {
        if (text != null) {
            return text.replaceAll("\n", "");
        } else return "";
    }

    public static String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    public static String generateRandomCid() {
        return String.valueOf(ThreadLocalRandom.current().nextLong(1_000_000_000_000L, 10_000_000_000_000L));
    }

    public static String getGenerationHashKey(final Long userId) {
        return "generations:user:" + userId;
    }

    public static Long getUserIdFromHashKey(String hashKey) {
        String regex = "generations:user:(\\d+)";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(hashKey);

        if (matcher.matches()) {
            return Long.parseLong(matcher.group(1));
        }

        return null;
    }

}
