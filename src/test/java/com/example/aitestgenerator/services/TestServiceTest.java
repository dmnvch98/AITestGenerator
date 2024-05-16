package com.example.aitestgenerator.services;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class TestServiceTest {

    @Autowired
    private TestService testService;

    @Test
    public void deleteTest() {
        testService.deleteTest(2L);
    }
}