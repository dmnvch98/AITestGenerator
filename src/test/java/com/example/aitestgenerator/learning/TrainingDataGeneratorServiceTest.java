package com.example.aitestgenerator.learning;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.IOException;

@SpringBootTest
class TrainingDataGeneratorServiceTest {

    @Autowired
    private TrainingDataGeneratorService service;

    @Test
    public void test() throws IOException {
        service.generateTrainingDataFile();
    }

}