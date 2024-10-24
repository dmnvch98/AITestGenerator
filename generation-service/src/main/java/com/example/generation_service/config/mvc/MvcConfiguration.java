package com.example.generation_service.config.mvc;

import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

@Configuration
public class MvcConfiguration implements WebMvcConfigurer {

  private final List<String> allowedOrigins;
  private final String secret;

  public MvcConfiguration(@Value("${security.allowed-origin}") final String allowedOrigins,
                          @Value("${generation.key}") final String secret) {
    this.allowedOrigins = Arrays.stream(allowedOrigins.split(",")).toList();
    this.secret = secret;
  }

  @Bean
  public OpenAiService openAiService() {
    return new OpenAiService(secret, Duration.ofSeconds(60));
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
