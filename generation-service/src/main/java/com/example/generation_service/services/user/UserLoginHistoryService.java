package com.example.generation_service.services.user;

import com.example.generation_service.models.user.UserLoginHistory;
import com.example.generation_service.repositories.user.UserLoginRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserLoginHistoryService {

    private final UserLoginRepository loginRepository;

    public void save(final UserLoginHistory loginHistory) {
        loginRepository.save(loginHistory);
    }
}
