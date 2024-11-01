import {useEffect, useRef} from "react";
import { Question, AnswerOption } from "../../../store/tests/testStore";
import {AccordionDetails, AccordionSummary, Box, IconButton, TextField} from "@mui/material";
import React from "react";
import AnswerOptionEdit from "../answerOptions/AnswerOptionEdit";
import Typography from "@mui/material/Typography";
import {DeleteOutlineOutlined} from "@mui/icons-material";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {v4 as uuidv4} from "uuid";

export interface QuestionEditProps {
    question: Question;
    onQuestionChange: (question: Question) => void;
    onDelete: () => void;
    errorMessage: string;
    questionNumber?: number;
    viewMode?: 'list' | 'paginated';
    last?: boolean;
}

export const QuestionEdit: React.FC<QuestionEditProps> = ({ question, onQuestionChange, onDelete, errorMessage,
                                                              questionNumber, last, viewMode }) => {
    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (errorMessage !== '' && errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [errorMessage]);

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onQuestionChange({ ...question, questionText: e.target.value });
    };

    const handleAddAnswerOption = () => {
        const newOption: AnswerOption = {
            id: uuidv4(),
            optionText: '',
            isCorrect: false,
        };
        onQuestionChange({ ...question, answerOptions: [...question.answerOptions, newOption] });
    };

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

    return (
        <Box sx={{ border: errorMessage ? '2px solid #ff604f' : 'none' }}>
            <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <TextField
                        label={"Вопрос " + questionNumber}
                        placeholder="Введите вопрос"
                        multiline
                        fullWidth
                        variant="standard"
                        value={question.questionText}
                        onChange={handleQuestionTextChange}
                        sx={{ '& .MuiInputBase-input': { fontWeight: 600 }, ml: 2 }}
                    />
                    <IconButton onClick={onDelete}>
                        <DeleteOutlineOutlined />
                    </IconButton>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    {question.answerOptions.map((answerOption, index) => (
                        <AnswerOptionEdit
                            key={index}
                            answerOption={answerOption}
                            onOptionChange={handleAnswerOptionChange}
                            onDelete={() => handleDeleteAnswerOption(answerOption.id as string)}
                        />
                    ))}
                    <Button onClick={handleAddAnswerOption} variant="outlined">
                        Добавить ответ
                    </Button>
                    {errorMessage && (
                        <Typography ref={errorRef} color="error" variant="body2" align="left">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </AccordionDetails>

            {(!last && viewMode === 'list') && <Divider sx={{ mt: 2, mb: 2 }} />}
        </Box>
    );
};
