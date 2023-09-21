package com.example.aitestgenerator.repositories;

import com.example.aitestgenerator.models.Test;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TestTwoRepository extends CrudRepository<Test, Long> {
    List<Test> findAllByTextId(Long textId);
}
