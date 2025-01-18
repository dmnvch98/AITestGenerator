package com.example.generation_service.controllers.users;

import com.example.generation_service.config.security.service.PrincipalUser;
import com.example.generation_service.dto.users.CreateUserRequestDto;
import com.example.generation_service.dto.users.UpdateUserFeatureRequestDto;
import com.example.generation_service.dto.users.UserResponseDto;
import com.example.generation_service.facades.user.UserFacade;
import com.example.generation_service.facades.user.UserFeatureFacade;
import com.example.generation_service.facades.user.UserLoginHistoryFacade;
import com.example.generation_service.models.user.UserFeature;
import com.example.generation_service.models.user.UserLoginHistory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserFacade userFacade;
    private final UserFeatureFacade userFeatureFacade;
    private final UserLoginHistoryFacade loginHistoryFacade;

    @PostMapping("/sign-up")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDto save(@RequestBody CreateUserRequestDto userDto) {
        return userFacade.save(userDto);
    }

    @GetMapping("/me")
    public UserResponseDto getMe(final Authentication authentication) {
        final Long userId = ((PrincipalUser) authentication.getPrincipal()).getUserId();
        return userFacade.getUser(userId);
    }

    @PutMapping("/{userId}/features")
    @PreAuthorize("hasAuthority('ADMIN')")
    public UserFeature updateUserFeature(@PathVariable Long userId, @RequestBody UpdateUserFeatureRequestDto dto) {
        return userFeatureFacade.updateUserFeature(userId, dto);
    }

    @GetMapping("/login-history")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<UserLoginHistory> getLoginHistory(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(required = false) String email) {
        return loginHistoryFacade.findAll(page, size, email);
    }
}
