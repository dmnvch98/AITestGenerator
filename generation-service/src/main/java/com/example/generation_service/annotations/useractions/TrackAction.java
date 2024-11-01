package com.example.generation_service.annotations.useractions;

import com.example.generation_service.annotations.enumeration.ActionType;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TrackAction {

    ActionType value();
}
