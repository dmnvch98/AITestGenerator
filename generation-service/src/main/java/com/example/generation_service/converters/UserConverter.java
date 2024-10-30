package com.example.generation_service.converters;

import com.example.generation_service.dto.users.CreateUserRequestDto;
import com.example.generation_service.dto.users.UserResponseDto;
import com.example.generation_service.models.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface UserConverter {
    @Mapping(source = "password", target = "password")
    User createUserDtoToUser(final CreateUserRequestDto createUserDto, final String password);

    UserResponseDto userToCreateUserResponseDto(final User user);
}
