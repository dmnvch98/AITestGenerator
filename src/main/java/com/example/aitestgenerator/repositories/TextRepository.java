package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.Text;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TextRepository extends CrudRepository<Text, Long> {
    List<Text> findAllByUserId(Long userId);
    List<Text> findAllByIdInAndUserId(List<Long> ids, Long userId);
    Text findAllByIdAndUserId(Long id, Long userId);
}
