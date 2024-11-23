package com.example.generation_service.config.aws;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmazonS3Config {

  @Value("${aws.region}")
  private String awsRegion;

  @Value("${aws.url}")
  private String s3Endpoint;

  @Value("${aws.access-key}")
  private String accessKey;

  @Value("${aws.secret-key}")
  private String secretKey;

  @Bean
  public AmazonS3 amazonS3() {
    BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
    return AmazonS3ClientBuilder.standard()
        .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
        .withRegion(awsRegion)
        .build();
  }
}
