import React, {useState} from "react";
import {Box, Button, Paper, Typography} from "@mui/material";
import {AnswerOption, Question} from "../../store/tests/testStore";
import {QuestionAnswer, usePassTestStore} from "../../store/tests/passTestStore";

export const QAP = ({
                        question,
                        questionNumber,
                        onNextQuestion
                    }: {
    question: Question;
    onNextQuestion: () => void;
    questionNumber: number;

}) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [accepted, setAccepted] = useState(false);
    const addAnswer = usePassTestStore(state => state.addAnswer);

    const getOptionColor = (option: AnswerOption) => {
        if (!accepted && isOptionSelected(option.id)) {
            return "#999"
        } else if (accepted && option.isCorrect) {
            return "#a3ccbe"
        } else if (accepted && isOptionSelected(option.id) && !option.isCorrect) {
            return "#e57373"
        }
    };

    const isOptionSelected = (optionId: number) => selectedOptions.includes(optionId);

    const handleOptionSelect = (optionId: number) => {
        if (selectedOptions.includes(optionId)) {
            setSelectedOptions((prevSelectedOptions) =>
                prevSelectedOptions.filter((id) => id !== optionId)
            );
        } else {
            setSelectedOptions((prevSelectedOptions) => [
                ...prevSelectedOptions,
                optionId
            ]);
        }
    }

    const handleAccept = () => {
        setAccepted(!accepted);
        let questionAnswer: QuestionAnswer = {
            questionNumber: questionNumber,
            isPassed: isAnswerCorrect()
        }
        addAnswer(questionAnswer);
    }

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
                <Typography variant='h5' align='left'>Вопрос {questionNumber}: {question.questionText}</Typography>
            </Box>

            <Box>
                {question.answerOptions.map((option) => (
                    <Box key={option.id} sx={{ width: "50%",
                        margin: "0 auto",
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
            </Box>

            <Box>
                <Button
                    variant='contained'
                    onClick={() => handleAccept()}
                    sx={{width: "25%"}}
                    size='large'>
                    Accept
                </Button>
                <Button
                    variant='contained'
                    onClick={() => {
                        onNextQuestion();
                        setAccepted(!accepted)
                        setSelectedOptions([])
                    }}
                    sx={{width: "25%"}}
                    size='large'>
                    Next
                </Button>
            </Box>
        </>
    )
}