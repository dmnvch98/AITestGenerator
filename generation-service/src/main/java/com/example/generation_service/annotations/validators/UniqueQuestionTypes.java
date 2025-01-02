package com.example.generation_service.annotations.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = UniqueQuestionTypeValidator.class)
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface UniqueQuestionTypes {
    String message() default "duplicated QuestionType";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
