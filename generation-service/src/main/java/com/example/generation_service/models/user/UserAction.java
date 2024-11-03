package com.example.generation_service.models.user;

import com.example.generation_service.annotations.enumeration.ActionType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_actions")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "action_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    @Column(name = "action_time", nullable = false)
    @Builder.Default
    private LocalDateTime actionTime = LocalDateTime.now();

}
