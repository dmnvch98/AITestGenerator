package com.example.generation_service.converters;

import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import org.mapstruct.Mapper;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@Mapper
public class MultipartFileConverter {

    public MultipartBody.Part convertToMultipartBodyPart(MultipartFile multipartFile) throws IOException {
        final RequestBody requestBody = RequestBody.create(
                multipartFile.getBytes(),
                okhttp3.MediaType.parse(Objects.requireNonNull(multipartFile.getContentType(),
                        "multipart file content type shouldn't be null"))
        );

        return MultipartBody.Part.createFormData(
                "file",
                multipartFile.getOriginalFilename(),
                requestBody
        );
    }
}
