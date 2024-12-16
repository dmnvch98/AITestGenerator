import React, {useEffect, useRef} from "react";
import {
    AccordionDetails,
    AccordionSummary,
    Box,
    IconButton,
    TextField,
    Grid,
    Checkbox
} from "@mui/material";
import {DeleteOutlineOutlined} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {Question, AnswerOption} from "../../../store/tests/testStore";
import { v4 as uuidv4 } from "uuid";
import Typography from "@mui/material/Typography";

interface MultipleChoiceMultipleAnswersProps {
    question: Question;
    onQuestionChange: (question: Question) => void;
    onDelete: () => void;
    errorMessage: string;
    questionNumber?: number;
}

export const MultipleAnswers: React.FC<MultipleChoiceMultipleAnswersProps> = ({
                                                                                                question, onQuestionChange, onDelete, errorMessage, questionNumber
                                                                                            }) => {
    const handleAnswerOptionChange = (updatedOption: AnswerOption) => {
        const updatedOptions = question.answerOptions.map(option =>
            option.id === updatedOption.id ? updatedOption : option
        );
        onQuestionChange({ ...question, answerOptions: updatedOptions });
    };

    const handleDeleteAnswerOption = (id: string) => {
        const updatedOptions = question.answerOptions.filter(option => option.id !== id);
        onQuestionChange({ ...question, answerOptions: updatedOptions });
    };

    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (errorMessage !== '' && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errorMessage]);


    const handleAddAnswerOption = () => {
        const newOption: AnswerOption = {
            id: uuidv4(),
            optionText: '',
            isCorrect: false,
        };
        onQuestionChange({ ...question, answerOptions: [...question.answerOptions, newOption] });
    };


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
                        sx={{'& .MuiInputBase-input': {fontWeight: 600}, ml: 2}}
                        onChange={(e) => onQuestionChange({...question, questionText: e.target.value})}
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

                            <Grid container spacing={3} alignItems="left" key={index}>
                                <Grid item xs={1}>
                                    <Checkbox
                                        size="medium"
                                        checked={answerOption.isCorrect}
                                        onChange={(e) => handleAnswerOptionChange({
                                            ...answerOption,
                                            isCorrect: e.target.checked
                                        })}

                                    />
                                </Grid>
                                <Grid item xs={10}>
                                    <TextField
                                        placeholder="Введите вариант ответа"
                                        multiline
                                        fullWidth
                                        variant="standard"
                                        value={answerOption.optionText}
                                        onChange={(e) => handleAnswerOptionChange({
                                            ...answerOption,
                                            optionText: e.target.value
                                        })}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton onClick={() => handleDeleteAnswerOption(answerOption.id as string)}>
                                        <DeleteOutlineOutlined/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={handleAddAnswerOption} variant="outlined" sx={{mt: 2}}>
                            Добавить ответ
                        </Button>
                        {errorMessage && (
                            <Typography ref={errorRef} color="error" variant="body2" align="left">
                                {errorMessage}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </AccordionDetails>
        </Box>
    );
};
