package com.example.generation_service.config.aws;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
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
    log.info("AWS Region: {}", awsRegion);
    log.info("S3 Endpoint: {}", s3Endpoint);

    log.info("AWS Access Key (partial): {}******", accessKey.substring(0, 4));
    log.info("AWS Secret Key (partial): {}******", secretKey.substring(0, 4));
    BasicAWSCredentials awsCreds = new BasicAWSCredentials(accessKey, secretKey);
    return AmazonS3ClientBuilder.standard()
            .withCredentials(new AWSStaticCredentialsProvider(awsCreds))
            .withEndpointConfiguration(new AwsClientBuilder.EndpointConfiguration(s3Endpoint, awsRegion))
            .withPathStyleAccessEnabled(true)
            .build();
  }
}

