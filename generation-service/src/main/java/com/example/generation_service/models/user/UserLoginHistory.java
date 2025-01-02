package com.example.generation_service.models.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserLoginHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime loginTime;
    private boolean success;
}
