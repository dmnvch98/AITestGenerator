package com.example.aitestgenerator.config.mvc;

import com.theokanning.openai.service.OpenAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;

@Configuration
public class MvcConfiguration implements WebMvcConfigurer {
    private final String allowedOrigin;

    public MvcConfiguration(@Value("${security.allowed-origin}") final String allowedOrigin) {
        this.allowedOrigin = allowedOrigin;
    }

    @Bean
    public OpenAiService openAiService () {
        return new OpenAiService(System.getenv("GENERATE_TEST_SECRET"), Duration.ofSeconds(300));
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowCredentials(true)
            .allowedOrigins(allowedOrigin)
            .allowedMethods("GET", "POST", "PUT", "DELETE", "PUT", "OPTIONS", "PATCH", "DELETE");
    }
}
