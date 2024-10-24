package com.example.generation_service.repositories;

import com.example.generation_service.models.GenerationInfo;
import org.springframework.data.repository.CrudRepository;

public interface GenerationInfoRepository extends CrudRepository<GenerationInfo, Long> {
}
