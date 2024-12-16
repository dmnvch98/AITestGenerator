import React from "react";
import {AccordionDetails, AccordionSummary, Box, Grid, IconButton, Radio, TextField} from "@mui/material";
import {DeleteOutlineOutlined} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {AnswerOption, Question} from "../../../store/tests/testStore";
import {v4 as uuidv4} from "uuid";
import {QuestionType} from "../../../store/tests/types";
import Typography from "@mui/material/Typography";

interface SingleAnswerProps {
    question: Question;
    onQuestionChange: (question: Question) => void;
    onDelete: () => void;
    errorMessage: string;
    questionNumber?: number;
}

export const SingleAnswer: React.FC<SingleAnswerProps> = ({
                                                                            question,
                                                                            onQuestionChange,
                                                                            onDelete,
                                                                            errorMessage,
                                                                            questionNumber
                                                                        }) => {
    const handleAnswerOptionChange = (updatedOption: AnswerOption) => {
        const updatedOptions = question.answerOptions.map(option => ({
            ...option,
            isCorrect: option.id === updatedOption.id, // Только одна правильная
        }));
        onQuestionChange({...question, answerOptions: updatedOptions});
    };

    const handleDeleteAnswerOption = (id: string) => {
        const updatedOptions = question.answerOptions.filter(option => option.id !== id);
        onQuestionChange({...question, answerOptions: updatedOptions});
    };

    const isMultiOptionsMode = question.questionType !== QuestionType.TRUE_FALSE;

    return (
        <Box>
            <AccordionSummary>
                <Box sx={{display: 'flex', alignItems: 'center', width: '100%'}}>
                    <TextField
                        label={`Вопрос ${questionNumber}`}
                        placeholder="Введите вопрос"
                        multiline
                        fullWidth
                        variant="standard"
                        value={question.questionText}
                        onChange={(e) => onQuestionChange({...question, questionText: e.target.value})}
                        sx={{'& .MuiInputBase-input': {fontWeight: 600}, ml: 2}}
                    />
                    <IconButton onClick={onDelete}>
                        <DeleteOutlineOutlined/>
                    </IconButton>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box sx={{ml: 2}}>
                    <Grid container spacing={3} alignItems="left" sx={{mb: 1}}>
                        <Grid item xs={1}>
                            <Typography fontWeight="bold">
                                Верно
                            </Typography>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography align="left" fontWeight="bold">
                                Вариант ответа
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                        </Grid>
                    </Grid>
                    <Box>
                        {question.answerOptions.map((answerOption, index) => (
                            <Grid container spacing={3} key={index} alignItems="center">
                                <Grid item xs={1}>
                                    <Radio
                                        checked={answerOption.isCorrect}
                                        onChange={() => handleAnswerOptionChange(answerOption)}
                                    />
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        placeholder="Введите вариант ответа"
                                        fullWidth
                                        multiline
                                        variant="standard"
                                        value={answerOption.optionText}
                                        onChange={(e) =>
                                            onQuestionChange({
                                                ...question,
                                                answerOptions: question.answerOptions.map(option =>
                                                    option.id === answerOption.id
                                                        ? {...option, optionText: e.target.value}
                                                        : option
                                                ),
                                            })
                                        }
                                    />
                                </Grid>
                                {
                                    isMultiOptionsMode && <Grid item xs={1}>
                                        <IconButton onClick={() => handleDeleteAnswerOption(answerOption.id as string)}>
                                            <DeleteOutlineOutlined/>
                                        </IconButton>
                                    </Grid>
                                }
                            </Grid>
                        ))}
                        {
                            isMultiOptionsMode &&
                            <Button variant="outlined" sx={{mt: 2}} onClick={() => onQuestionChange({
                                ...question,
                                answerOptions: [
                                    ...question.answerOptions,
                                    {id: uuidv4(), optionText: '', isCorrect: false},
                                ],
                            })}>
                                Добавить ответ
                            </Button>
                        }

                    </Box>
                </Box>
            </AccordionDetails>
        </Box>
    );
};
