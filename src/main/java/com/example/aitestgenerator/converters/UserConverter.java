package com.example.aitestgenerator.converters;

import com.example.aitestgenerator.dto.CreateUserRequestDto;
import com.example.aitestgenerator.dto.CreateUserResponseDto;
import com.example.aitestgenerator.models.User;
import org.mapstruct.Mapper;

@Mapper
public interface UserConverter {
    User createUserDtoToUser(CreateUserRequestDto createUserDto);

    CreateUserResponseDto userToCreateUserResponseDto(User user);
}
