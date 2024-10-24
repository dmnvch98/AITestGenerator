package com.example.generation_service.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_ratings")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestRating {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  @Setter
  private Double rating;

  @Setter
  private String feedback;

  private Long userId;

  private Long testId;

}
