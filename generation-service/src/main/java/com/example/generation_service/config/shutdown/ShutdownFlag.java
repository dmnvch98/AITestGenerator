package com.example.generation_service.config.shutdown;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
public class ShutdownFlag {

    private volatile boolean shuttingDown = false;

}
