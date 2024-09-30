package com.example.aitestgenerator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableScheduling
@EnableRetry
@EnableTransactionManagement
@EnableAsync
public class AiTestGeneratorApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiTestGeneratorApplication.class, args);
    }

}
