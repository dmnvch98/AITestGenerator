package com.example.generation_service.converters;

import com.example.generation_service.dto.users.CreateUserRequestDto;
import com.example.generation_service.dto.users.UserResponseDto;
import com.example.generation_service.models.User;
import org.mapstruct.Mapper;

@Mapper
public interface UserConverter {
    User createUserDtoToUser(CreateUserRequestDto createUserDto);

    UserResponseDto userToCreateUserResponseDto(User user);
}
