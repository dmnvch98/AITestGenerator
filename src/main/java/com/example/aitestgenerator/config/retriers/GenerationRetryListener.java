package com.example.aitestgenerator.config.retriers;

import com.example.aitestgenerator.config.shutdown.ShutdownFlag;
import com.example.aitestgenerator.services.ActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.retry.RetryCallback;
import org.springframework.retry.RetryContext;
import org.springframework.retry.RetryListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class GenerationRetryListener implements RetryListener {

  private final ShutdownFlag shutdownFlag;
  private final ActivityService activityService;

  @Override
  public <T, E extends Throwable> boolean open(final RetryContext context, final RetryCallback<T, E> callback) {
    return true;
  }

  @Override
  public <T, E extends Throwable> void close(final RetryContext context, final RetryCallback<T, E> callback,
                                             final Throwable throwable) {
    if (!shutdownFlag.isShuttingDown() && throwable != null) {
      log.warn("All retry attempts exhausted");
      final String hashKey = (String) context.getAttribute("hashKey");
      final String cid = (String) context.getAttribute("cid");
      if (hashKey != null && cid != null) {
        activityService.failActivity(hashKey, cid, throwable);
      }
    }
  }

  @Override
  public <T, E extends Throwable> void onError(RetryContext context, RetryCallback<T, E> callback, Throwable throwable) {
    log.error("Retry attempt {} failed.", context.getRetryCount(), throwable);
    if (!shutdownFlag.isShuttingDown() && throwable != null) {
      final String hashKey = (String) context.getAttribute("hashKey");
      final String cid = (String) context.getAttribute("cid");
      if (hashKey != null && cid != null) {
        activityService.failActivityIfFatal(hashKey, cid, throwable);
      }
    }
  }
}
