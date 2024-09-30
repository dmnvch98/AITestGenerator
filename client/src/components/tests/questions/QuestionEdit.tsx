import {useState, useEffect, useRef} from "react";
import { Question, AnswerOption } from "../../../store/tests/testStore";
import {AccordionDetails, AccordionSummary, Box, IconButton, TextField} from "@mui/material";
import React from "react";
import AnswerOptionEdit from "../answerOptions/AnswerOptionEdit";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Typography from "@mui/material/Typography";
import {DeleteOutlineOutlined} from "@mui/icons-material";

export interface QuestionEditProps {
    question: Question;
    onQuestionChange: (question: Question) => void;
    onDelete: () => void;
    errorMessage: string;
    questionNumber?: number;
}

export const QuestionEdit: React.FC<QuestionEditProps> = ({ question, onQuestionChange, onDelete, errorMessage,
                                                              questionNumber}) => {
    const [questionText, setQuestionText] = useState(question.questionText);
    const [answerOptions, setAnswerOptions] = useState(question.answerOptions);
    const [expanded, setExpanded] = useState(true);
    const errorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (errorMessage !== '') {
            setExpanded(true);
            if (errorRef.current) {
                errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [errorMessage]);

    useEffect(() => {
        setQuestionText(question.questionText);
        setAnswerOptions(question.answerOptions);
    }, [question]);

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionText(e.target.value);
        onQuestionChange({ ...question, questionText: e.target.value, answerOptions });
    };

    const handleAddAnswerOption = () => {
        const newOption: AnswerOption = {
            id: answerOptions.length > 0 ? Math.max(...answerOptions.map(o => o.id || 0)) + 1 : 1,
            optionText: '',
            isCorrect: false
        };
        const updatedOptions = [...answerOptions, newOption];
        setAnswerOptions(updatedOptions);
        onQuestionChange({ ...question, questionText, answerOptions: updatedOptions });
    };

    const handleAnswerOptionChange = (updatedOption: AnswerOption) => {
        const updatedOptions = answerOptions.map(option =>
            option.id === updatedOption.id ? updatedOption : option
        );
        setAnswerOptions(updatedOptions);
        onQuestionChange({ ...question, questionText, answerOptions: updatedOptions });
    };

    const handleDeleteAnswerOption = (id: number) => {
        const updatedOptions = answerOptions.filter(option => option.id !== id);
        setAnswerOptions(updatedOptions);
        onQuestionChange({ ...question, questionText, answerOptions: updatedOptions });
    };

    return (
        <Box sx={{border: errorMessage ? '2px solid #ff604f' : 'none' }}>
            <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%'}}>
                    <TextField
                        label={"Вопрос " + questionNumber}
                        placeholder="Введите вопрос"
                        multiline
                        fullWidth
                        variant="standard"
                        value={questionText}
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
                    {answerOptions.map((answerOption, index) => (
                        <AnswerOptionEdit
                            key={index}
                            answerOption={answerOption}
                            onOptionChange={handleAnswerOptionChange}
                            onDelete={() => handleDeleteAnswerOption(answerOption.id as number)}
                        />
                    ))}
                    <IconButton onClick={handleAddAnswerOption} color="primary" >
                        <AddCircleIcon sx={{ fontSize: 36 }} />
                    </IconButton>
                    {errorMessage && (
                        <Typography ref={errorRef} color="error" variant="body2" align="left">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </AccordionDetails>
        </Box>
    );
};

export default QuestionEdit;
