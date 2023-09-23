import React, { useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Question, AnswerOption } from "../../store/tests/testStore";

export const QuestionAnswersPage = ({
                                        question,
                                        onNextQuestion
                                    }: {
    question: Question;
    onNextQuestion: () => void;
}) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [isAcceptButtonClicked, setIsAcceptButtonClicked] = useState(false);

    const handleOptionSelect = (optionId: number) => {
        // Проверяем, была ли уже нажата кнопка "Accept"
        if (isAcceptButtonClicked) {
            return;
        }

        // Если выбранный вариант уже есть в массиве selectedOptions, удаляем его
        if (selectedOptions.includes(optionId)) {
            setSelectedOptions((prevSelectedOptions) =>
                prevSelectedOptions.filter((id) => id !== optionId)
            );
        } else {
            // В противном случае, добавляем его в массив
            setSelectedOptions((prevSelectedOptions) => [
                ...prevSelectedOptions,
                optionId
            ]);
        }
    };

    const isOptionSelected = (optionId: number) => selectedOptions.includes(optionId);

    const handleAccept = () => {
        // После нажатия кнопки "Accept" устанавливаем флаг
        setIsAcceptButtonClicked(true);

        // Проверка правильности выбранных ответов
        const areSelectedOptionsCorrect = selectedOptions.every((optionId) => {
            const selectedOption = question.answerOptions.find((option) => option.id === optionId);
            return selectedOption?.isCorrect || false;
        });

        // Можете выполнить дополнительную обработку на основе areSelectedOptionsCorrect

        // Переход к следующему вопросу
        onNextQuestion();
    };

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography>{question.questionText}</Typography>
            </Box>
            {question.answerOptions.map((option) => (
                <Box key={option.id}>
                    <Paper
                        onClick={() => handleOptionSelect(option.id)}
                        sx={{
                            cursor: isAcceptButtonClicked ? "default" : "pointer",
                            backgroundColor: isOptionSelected(option.id)
                                ? option.isCorrect
                                    ? "#4caf50" // Зеленый для правильного выбора
                                    : "#f44336" // Красный для неправильного выбора
                                : "white"
                        }}
                    >
                        <Typography>{option.optionText}</Typography>
                    </Paper>
                </Box>
            ))}
            <Box sx={{ mt: 2 }}>
                {!isAcceptButtonClicked && (
                    <Button variant="contained" onClick={handleAccept}>
                        Accept
                    </Button>
                )}
                <Button variant="contained" onClick={onNextQuestion}>
                    Next
                </Button>
            </Box>
        </>
    );
};
