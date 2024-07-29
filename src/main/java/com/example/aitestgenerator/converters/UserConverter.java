package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.users.CreateUserRequestDto;
import com.example.aitestgenerator.dto.users.UserResponseDto;
import com.example.aitestgenerator.models.User;
import org.mapstruct.Mapper;

@Mapper
public interface UserConverter {
    User createUserDtoToUser(CreateUserRequestDto createUserDto);

    UserResponseDto userToCreateUserResponseDto(User user);
}
