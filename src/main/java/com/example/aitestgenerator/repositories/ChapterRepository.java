package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.Chapter;
import com.example.aitestgenerator.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;


public interface ChapterRepository extends CrudRepository<Chapter, Long> {
    Chapter findAllById(Long id);

    List<Chapter> findAllByUser(User user);

    int countAllByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndUserId(Long id, Long userId);

}
