import React from "react";
import {Box, TextField, IconButton} from "@mui/material";
import {DeleteOutlineOutlined} from "@mui/icons-material";

interface QuestionHeaderProps {
    questionNumber?: number;
    questionText: string;
    onChange: (newText: string) => void;
    onDelete: () => void;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
                                                                  questionNumber, questionText, onChange, onDelete
                                                              }) => (
    <Box sx={{display: "flex", alignItems: "center", width: "100%"}}>
        <TextField
            label={`Вопрос ${questionNumber}`}
            placeholder="Введите вопрос"
            fullWidth
            variant="standard"
            value={questionText}
            onChange={(e) => onChange(e.target.value)}
            sx={{ml: 2, "& .MuiInputBase-input": {fontWeight: 600}}}
        />
        <IconButton onClick={onDelete}>
            <DeleteOutlineOutlined />
        </IconButton>
    </Box>
);
