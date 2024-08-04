package com.example.aitestgenerator.config.mvc;

import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

@Configuration
public class MvcConfiguration implements WebMvcConfigurer {

    private final List<String> allowedOrigins;

    public MvcConfiguration(@Value("${security.allowed-origin}") final String allowedOrigins) {
        this.allowedOrigins = Arrays.stream(allowedOrigins.split(",")).toList();
    }

    @Bean
    public OpenAiService openAiService () {
        return new OpenAiService(System.getenv("GENERATE_TEST_SECRET"), Duration.ofSeconds(300));
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(allowedOrigins);
        config.setAllowCredentials(true);
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
