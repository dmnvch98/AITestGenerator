package com.example.generation_service.facades.user;

import com.example.generation_service.models.user.UserLoginHistory;
import com.example.generation_service.services.user.UserLoginHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class UserLoginHistoryFacade {

    private final UserLoginHistoryService loginHistoryService;

    public List<UserLoginHistory> findAll(int page, int size) {
        Page<UserLoginHistory> loginPage = loginHistoryService.findAll(page, size);
        return loginPage.getContent();
    }
}
