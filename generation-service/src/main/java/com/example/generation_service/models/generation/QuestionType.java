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
            "A question with only one correct answer",
            """
                    Example:
                    Which of the following elements is a metal?
                    answer: Iron
                    """,
            1,
            1,
            true
    ),

    /**
     * Multiple Choice with Multiple Answers
     * A question with several options, where at least two are correct.
     */
    MULTIPLE_CHOICE_MULTIPLE_ANSWERS(
            "Multiple Choice (Multiple Answers)",
            "A question with at least two correct answers.",
            """
                    Example:
                    Which of the following elements are metals?
                    a) Iron
                    b) Copper""",
            2,
            4,
            true
    ),

    /**
     * True/False
     * A statement that needs to be evaluated as either true or false.
     */
    TRUE_FALSE(
            "True/False",
            "A statement that needs to be evaluated as either true or false.",
            """
                    Example:
                    The Earth orbits the Sun.
                    answer: true
                    """,
            1,
            1,
            false
    ),

    FILL_IN_THE_BLANKS(
            "Fill in the Blanks",
            "A sentence or text with a single missing word or blank to be filled in. Only one blank is allowed per sentence.",
            """
                    Example:
                    Water boils at ____ degrees Celsius
                    answer: 100
                    """,
            1,
            1,
            true
    );

    private final String name;
    private final String description;
    private final String example;
    private final int minCorrectAnswers;
    private final int maxCorrectAnswers;
    private final boolean shouldGenerateIncorrectOptions;

    /**
     * Constructor for the TestQuestionsType enum.
     *
     * @param name        The name of the question type.
     * @param description The description of the question type.
     * @param example     An example of the question type.
     */
    QuestionType(String name, String description, String example, int minCorrectAnswers, int maxCorrectAnswers, boolean shouldGenerateIncorrectAnswers) {
        this.name = name;
        this.description = description;
        this.example = example;
        this.minCorrectAnswers = minCorrectAnswers;
        this.maxCorrectAnswers = maxCorrectAnswers;
        this.shouldGenerateIncorrectOptions = shouldGenerateIncorrectAnswers;
    }

}
