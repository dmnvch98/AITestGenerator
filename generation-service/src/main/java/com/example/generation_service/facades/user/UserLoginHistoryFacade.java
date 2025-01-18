package com.example.generation_service.facades.user;

import com.example.generation_service.models.user.UserLoginHistory;
import com.example.generation_service.services.user.UserLoginHistoryService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserLoginHistoryFacade {

    private final UserLoginHistoryService loginHistoryService;

    public List<UserLoginHistory> findAll(int page, int size, String email) {
        Page<UserLoginHistory> loginHistories;
        if (StringUtils.isNotEmpty(email)) {
            loginHistories = loginHistoryService.findByEmail(page, size, email);
        } else {
            loginHistories = loginHistoryService.findAll(page, size);
        }
        return loginHistories.getContent();
    }
}
