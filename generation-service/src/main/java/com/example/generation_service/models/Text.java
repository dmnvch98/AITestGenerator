package com.example.generation_service.models;


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
    private Long id;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "title", columnDefinition = "text")
    private String title;
    @Column(name = "content", columnDefinition = "text")
    private String content;
//    @OneToMany(mappedBy = "text", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<TestGeneratingHistory> generatingHistories;
    @Override
    public String toString() {
        return "Text{" +
            "title='" + title + '\'' +
            ", content='" + content + '\'' +
            '}';
    }
}
