package com.example.aitestgenerator.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "texts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Text {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    @Column(name = "user_id")
    Long userId;
    @Column(name = "title")
    String title;
    @Column(name = "content")
    String content;

    @Override
    public String toString() {
        return "Text{" +
            "title='" + title + '\'' +
            ", content='" + content + '\'' +
            '}';
    }
}
