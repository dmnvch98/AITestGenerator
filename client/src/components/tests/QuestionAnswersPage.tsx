import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { AnswerOption, Question } from "../../store/tests/testStore";
import { QuestionAnswer, usePassTestStore } from "../../store/tests/passTestStore";
import { appColors } from "../../styles/appColors";

export const QuestionAnswersPage = ({
                                        question,
                                        questionNumber,
                                        allQuestionsNumber,
                                        onNextQuestion,
                                        testTitle,
                                        currentTestNumber,
                                        allTestsNumber,
                                    }: {
    question: Question;
    onNextQuestion: () => void;
    questionNumber: number;
    allQuestionsNumber: number;
    testTitle: string;
    currentTestNumber: number;
    allTestsNumber: number;
}) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [answered, setAnswered] = useState(false);
    const [acceptCalled, setAcceptCalled] = useState(false);
    const addAnswer = usePassTestStore((state) => state.addAnswer);

    const handleNext = () => {
        if (answered || selectedOptions.length === 0) {
            onNextQuestion();
            setAnswered(false);
            setSelectedOptions([]);
            setAcceptCalled(false);
        } else {
            setAnswered(true);
        }
        accept();
    };

    const getOptionColor = (option: AnswerOption) => {
        const isSelected = isOptionSelected(option.id);

        if (!answered && isSelected) {
            return appColors.primary.default;
        }

        if (answered) {
            if (option.correct) {
                return appColors.primary.main;
            } else if (isSelected && !option.correct) {
                return appColors.error.main;
            }
        }

        return "transparent";
    };

    const isOptionSelected = (optionId: number) => selectedOptions.includes(optionId);

    const handleOptionSelect = (optionId: number) => {
        if (!answered) {
            setSelectedOptions((prevSelectedOptions) =>
                prevSelectedOptions.includes(optionId)
                    ? prevSelectedOptions.filter((id) => id !== optionId)
                    : [...prevSelectedOptions, optionId]
            );
        }
    };

    const accept = () => {
        if (!acceptCalled) {
            const questionAnswer: QuestionAnswer = {
                questionNumber: questionNumber,
                passed: isAnswerCorrect(),
            };
            addAnswer(questionAnswer);
            setAcceptCalled(true);
        }
    };

    const isAnswerCorrect = (): boolean => {
        const correctOptionIds = question.answerOptions
            .filter((op) => op.correct)
            .map((op) => op.id);

        return (
            correctOptionIds.length === selectedOptions.length &&
            correctOptionIds.every((id) => selectedOptions.includes(id))
        );
    };

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" align="left">
                    Вопрос {questionNumber} из {allQuestionsNumber}: {question.questionText}
                </Typography>
                <Typography align="left" sx={{ mt: 1 }}>
                    Тема теста: {testTitle}
                </Typography>
                <Typography align="left" sx={{ mt: 1 }}>
                    Тест {currentTestNumber} из {allTestsNumber}
                </Typography>
            </Box>

            <Box
                sx={{
                    width: "70%",
                    margin: "0 auto",
                }}
            >
                {question.answerOptions.map((option) => (
                    <Box
                        key={option.id}
                        sx={{
                            mb: 2,
                            borderRadius: 1,
                            border: `2px solid ${getOptionColor(option)}`,
                        }}
                    >
                        <Paper
                            onClick={() => handleOptionSelect(option.id)}
                            sx={{
                                p: 3,
                                cursor: "pointer",
                            }}
                        >
                            <Typography align="left">{option.optionText}</Typography>
                        </Paper>
                    </Box>
                ))}

                <Box>
                    <Button variant="contained" onClick={handleNext} size="large" fullWidth>
                        Дальше
                    </Button>
                </Box>
            </Box>
        </>
    );
};
