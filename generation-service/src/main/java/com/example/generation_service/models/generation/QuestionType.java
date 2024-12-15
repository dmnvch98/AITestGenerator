package com.example.generation_service.models.generation;

import lombok.Getter;

/**
 * Enum for types of test questions with their descriptions and examples.
 */

@Getter
public enum QuestionType {

    /**
     * Multiple Choice
     * A question with several options, where only one is correct.
     */
    MULTIPLE_CHOICE_SINGLE_ANSWER(
            "Multiple Choice",
            "A question with several options, where only one is correct.",
            """
                    Example:
                    Which of the following elements is a metal?
                    a) Carbon
                    b) Oxygen
                    c) Iron
                    d) Nitrogen""",
            true
    ),

    /**
     * Multiple Choice with Multiple Answers
     * A question with several options, where at least two are correct.
     */
    MULTIPLE_CHOICE_MULTIPLE_ANSWERS(
            "Multiple Choice (Multiple Answers)",
            "A question with several options, where at least two answers are correct.",
            """
                    Example:
                    Which of the following elements are metals?
                    a) Carbon
                    b) Oxygen
                    c) Iron
                    d) Copper""",
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

    FILL_IN_THE_BLANKS(
            "Fill in the Blanks",
            "A sentence or text with a single missing word or blank to be filled in. Only one blank is allowed per sentence.",
            "Example:" +
                    "Water boils at ____ degrees Celsius.\n" +
                    "The capital of France is ____.",
            true
    );

    private final String name;
    private final String description;
    private final String example;
    private final boolean shouldGenerateIncorrectOptions;

    /**
     * Constructor for the TestQuestionsType enum.
     *
     * @param name        The name of the question type.
     * @param description The description of the question type.
     * @param example     An example of the question type.
     */
    QuestionType(String name, String description, String example, boolean shouldGenerateIncorrectAnswers) {
        this.name = name;
        this.description = description;
        this.example = example;
        this.shouldGenerateIncorrectOptions = shouldGenerateIncorrectAnswers;
    }

}
