package com.example.generation_service.annotations.cid;

import com.example.generation_service.annotations.enumeration.CidType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD) // Можно использовать только над методами
@Retention(RetentionPolicy.RUNTIME) // Доступно в рантайме
public @interface GenerateCid {
    CidType value();
}
