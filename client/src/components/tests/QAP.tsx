import React, {useState} from "react";
import {Box, Button, Paper, Typography} from "@mui/material";
import {AnswerOption, Question} from "../../store/tests/testStore";
import {QuestionAnswer, usePassTestStore} from "../../store/tests/passTestStore";

export const QAP = ({
                        question,
                        questionNumber,
                        allQuestionsNumber,
                        onNextQuestion
                    }: {
    question: Question;
    onNextQuestion: () => void;
    questionNumber: number;
    allQuestionsNumber: number;

}) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [answered, setAnswered] = useState(false);
    const addAnswer = usePassTestStore(state => state.addAnswer);

    const handleNext = () => {
        if (answered || selectedOptions.length === 0) {
            setAnswered(false);
            onNextQuestion();
        } else {
            setAnswered(true);
            handleAccept();
        }
    };

    const getOptionColor = (option: AnswerOption) => {
        if (!answered && isOptionSelected(option.id)) {
            return "#999"
        } else if (answered && option.isCorrect) {
            return "#a3ccbe"
        } else if (answered && isOptionSelected(option.id) && !option.isCorrect) {
            return "#e57373"
        }
    };

    const isOptionSelected = (optionId: number) => selectedOptions.includes(optionId);

    const handleOptionSelect = (optionId: number) => {
        if (!answered) {
            setSelectedOptions(prevSelectedOptions => {
                if (prevSelectedOptions.includes(optionId)) {
                    return prevSelectedOptions.filter(id => id !== optionId);
                } else {
                    return [...prevSelectedOptions, optionId];
                }
            });
        }
    };

    const handleAccept = () => {
        const questionAnswer: QuestionAnswer = {
            questionNumber: questionNumber,
            isPassed: isAnswerCorrect()
        };
        addAnswer(questionAnswer);
    };

    const isAnswerCorrect = (): boolean => {
        if (question.answerOptions.filter(op => op.isCorrect).length !== selectedOptions.length) {
            return false;
        }

        return question.answerOptions
            .filter(op => op.isCorrect)
            .map(op => op.id)
            .every((element) => selectedOptions.includes(element));
    }

    return (
        <>
            <Box sx={{mb: 2}}>
                <Typography variant='h5'
                            align='left'>Вопрос {questionNumber} из {allQuestionsNumber}: {question.questionText}</Typography>
            </Box>

            <Box sx={{
                width: "50%",
                margin: "0 auto"
            }}>
                {question.answerOptions.map((option) => (
                    <Box key={option.id} sx={{
                        mb: 2,
                        borderRadius: 1,
                        border: "2px solid " + getOptionColor(option)
                    }}>
                        <Paper
                            onClick={() => handleOptionSelect(option.id)}
                            sx={{
                                p: 3,
                                cursor: 'pointer',
                            }}
                        >
                            <Typography>{option.optionText}</Typography>
                        </Paper>
                    </Box>
                ))}

                <Box>
                    <Button
                        variant='contained'
                        onClick={handleNext}
                        size='large'
                        fullWidth
                    >
                        Next
                    </Button>
                </Box>
            </Box>
        </>
    )
}