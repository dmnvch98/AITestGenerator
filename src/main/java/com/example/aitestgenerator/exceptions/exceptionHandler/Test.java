package com.example.aitestgenerator.exceptions.exceptionHandler;

import static com.example.aitestgenerator.utils.Utils.countTokens;

public class Test {
    public static void main(String[] args) {
        System.out.println(countTokens("Как дела?"));
        System.out.println(countTokens("У меня всё отлично, спасибо! А как у вас?"));
    }
}
