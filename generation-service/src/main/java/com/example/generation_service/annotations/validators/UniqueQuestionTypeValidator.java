package com.example.generation_service.annotations.validators;

import com.example.generation_service.dto.tests.QuestionTypeQuantity;
import com.example.generation_service.models.generation.QuestionType;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.HashSet;
import java.util.List;

public class UniqueQuestionTypeValidator implements ConstraintValidator<UniqueQuestionTypes, List<QuestionTypeQuantity>> {

    @Override
    public boolean isValid(List<QuestionTypeQuantity> value, ConstraintValidatorContext context) {
        if (value == null || value.isEmpty()) {
            return true;
        }

        HashSet<QuestionType> uniqueQuestionTypes = new HashSet<>();
        for (QuestionTypeQuantity item : value) {
            if (!uniqueQuestionTypes.add(item.getQuestionType())) {
                return false;
            }
        }
        return true;
    }
}
