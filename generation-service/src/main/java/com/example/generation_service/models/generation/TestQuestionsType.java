package com.example.generation_service.models.generation;

import lombok.Getter;

/**
 * Enum for types of test questions with their descriptions and examples.
 */

@Getter
public enum TestQuestionsType {

    /**
     * Multiple Choice
     * A question with several options, where only one is correct.
     */
    MULTIPLE_CHOICE_SINGLE_ANSWER(
            "Multiple Choice",
            "A question with several options, where only one is correct.",
            "Example:\n" +
                    "Which of the following elements is a metal?\n" +
                    "a) Carbon\n" +
                    "b) Oxygen\n" +
                    "c) Iron\n" +
                    "d) Nitrogen",
            true
    ),

    /**
     * Multiple Choice with Multiple Answers
     * A question with several options, where at least two are correct.
     */
    MULTIPLE_CHOICE_MULTIPLE_ANSWERS(
            "Multiple Choice (Multiple Answers)",
            "A question with several options, where at least two answers are correct.",
            "Example:\n" +
                    "Which of the following elements are metals?\n" +
                    "a) Carbon\n" +
                    "b) Oxygen\n" +
                    "c) Iron\n" +
                    "d) Copper",
            true
    ),

    /**
     * True/False
     * A statement that needs to be evaluated as either true or false.
     */
    TRUE_FALSE(
            "True/False",
            "A statement that needs to be evaluated as either true or false.",
            "Example:\n" +
                    "The Earth orbits the Sun. (True/False)",
            false
    ),

    /**
     * Fill in the Blanks
     * A sentence or text with missing words to be filled in.
     */
    FILL_IN_THE_BLANKS(
            "Fill in the Blanks",
            "A sentence or text with missing words to be filled in.",
            "Example:\n" +
                    "Water boils at ____ degrees Celsius.",
            false
    );

    private final String name;
    private final String description;
    private final String example;
    private final boolean shouldGenerateIncorrectAnswers;

    /**
     * Constructor for the TestQuestionsType enum.
     *
     * @param name        The name of the question type.
     * @param description The description of the question type.
     * @param example     An example of the question type.
     */
    TestQuestionsType(String name, String description, String example, boolean shouldGenerateIncorrectAnswers) {
        this.name = name;
        this.description = description;
        this.example = example;
        this.shouldGenerateIncorrectAnswers = shouldGenerateIncorrectAnswers;
    }

}
