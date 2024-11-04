package com.example.generation_service.config.security.service;

import com.example.generation_service.models.user.User;
import com.example.generation_service.services.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(final String email) throws UsernameNotFoundException {
        final User user = userService.findUserByEmail(email);

        return new PrincipalUser(user.getEmail(), user.getPassword(), List.of(new SimpleGrantedAuthority(user.getRole().name())), user.getId());
    }
}
