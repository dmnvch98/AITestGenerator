package com.example.generation_service.models.webhook;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "alerts")
public class OpenAiStatusAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String incidentId;

    @Enumerated(EnumType.STRING)
    private IncidentStatus status;
}
