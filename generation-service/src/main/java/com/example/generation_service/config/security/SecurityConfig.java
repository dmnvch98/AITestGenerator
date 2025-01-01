package com.example.generation_service.config.security;

import com.example.generation_service.config.security.filter.JwtFilter;
import com.example.generation_service.config.security.service.AuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

  private final JwtFilter jwtFilter;
  private final AuthenticationEntryPoint authenticationEntryPoint;

  @Bean
  public SecurityFilterChain formLoginFilterChain(final HttpSecurity http) throws Exception {
    http
        .requiresChannel(channel -> channel.anyRequest().requiresSecure())
        .csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.POST, "/api/v1/auth/**").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/users/sign-up").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/incidents/webhook/resolve").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/v1/sse/subscribe").permitAll()
            .requestMatchers(HttpMethod.POST, "/api/v1/activities/all").hasAuthority("ADMIN")
            .anyRequest()
            .authenticated()
        )
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
        .exceptionHandling(ex -> ex.authenticationEntryPoint(authenticationEntryPoint));

    return http.build();
  }

}
