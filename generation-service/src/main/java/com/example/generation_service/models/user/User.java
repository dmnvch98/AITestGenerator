package com.example.generation_service.models.user;

import com.example.generation_service.config.security.roles.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.USER;
    private String refreshToken;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserFeature> userFeatures = new ArrayList<>();
    private LocalDateTime lastLogin;

    public void addUserFeature(UserFeature feature) {
        feature.setUser(this);
        userFeatures.add(feature);
    }

    public void initializeFeatures(Map<Feature, Boolean> featureSettings) {
        for (Feature feature : Feature.values()) {
            final Boolean enabled = featureSettings.getOrDefault(feature, true);
            final UserFeature userFeature = UserFeature.builder()
                    .name(feature)
                    .enabled(enabled)
                    .createdAt(LocalDateTime.now())
                    .build();
            addUserFeature(userFeature);
        }
    }

}
