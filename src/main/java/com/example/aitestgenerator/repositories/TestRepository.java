package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.Test;
import com.example.aitestgenerator.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TestRepository extends CrudRepository<Test, Long> {
    List<Test> findAllByUser(User user);

    Test findTestByIdAndUser(Long id, User user);

    Test findTestByIdAndUserId(Long id, Long userId);
}
