import { useState } from "react";
import { Question, AnswerOption } from "../../../store/tests/testStore";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, IconButton, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import AnswerOptionEdit from "../answerOptions/AnswerOptionEdit";
import ClearIcon from "@mui/icons-material/Clear";

export const QuestionEdit = ({ question, onQuestionChange, onDelete }: { question: Question, onQuestionChange: (question: Question) => void, onDelete: () => void }) => {
    const [questionText, setQuestionText] = useState(question.questionText);
    const [answerOptions, setAnswerOptions] = useState(question.answerOptions);
    const [expanded, setExpanded] = useState(false);

    const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionText(e.target.value);
        onQuestionChange({ ...question, questionText: e.target.value, answerOptions });
    };

    const handleAddAnswerOption = () => {
        const newOption: AnswerOption = {
            id: answerOptions.length + 1,
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

    const handleExpandClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        setExpanded(!expanded);
    };

    return (
        <Accordion expanded={expanded}>
            <AccordionSummary
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <IconButton
                        onClick={handleExpandClick}
                        edge="start"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                    <TextField
                        fullWidth
                        variant="standard"
                        value={questionText}
                        onChange={handleQuestionTextChange}
                        sx={{ '& .MuiInputBase-input': { fontWeight: 500 } }}
                    />
                    <IconButton onClick={onDelete}>
                        <ClearIcon />
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
                    <Button variant="outlined" onClick={handleAddAnswerOption}>
                        Добавить вариант
                    </Button>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default QuestionEdit;
