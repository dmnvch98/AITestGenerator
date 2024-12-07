package com.example.generation_service.services.user;

import com.example.generation_service.models.user.UserLoginHistory;
import com.example.generation_service.repositories.user.UserLoginRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserLoginHistoryService {

    private final UserLoginRepository loginRepository;

    public void save(final UserLoginHistory loginHistory) {
        loginRepository.save(loginHistory);
    }

    public Page<UserLoginHistory> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("loginTime").descending());
        return loginRepository.findAll(pageable);
    }
}
