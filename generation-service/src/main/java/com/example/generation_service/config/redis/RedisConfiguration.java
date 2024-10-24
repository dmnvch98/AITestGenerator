package com.example.generation_service.config.redis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.listener.ChannelTopic;

@Configuration
public class RedisConfiguration {

  @Bean
  public ChannelTopic channelTopic() {
    final String topic = "user-generation";
    return new ChannelTopic(topic);
  }

}