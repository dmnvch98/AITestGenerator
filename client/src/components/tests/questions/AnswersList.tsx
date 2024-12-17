import React from "react";
import {Box, Grid, TextField, IconButton, Checkbox, Radio, Button} from "@mui/material";
import {DeleteOutlineOutlined} from "@mui/icons-material";
import {AnswerOption} from "../../../store/tests/testStore";

interface AnswerListProps {
    answerOptions: AnswerOption[];
    onAnswerChange: (updatedOption: AnswerOption) => void;
    onDeleteAnswer: (id?: string) => void;
    onAddAnswer?: () => void;
    singleChoice?: boolean;
    displayActions: boolean;
}

export const AnswerList: React.FC<AnswerListProps> = ({
                                                          answerOptions, onAnswerChange, onDeleteAnswer, onAddAnswer, singleChoice , displayActions
                                                      }) => (
    <Box>
        {answerOptions.map((answer, index) => (
            <Grid container spacing={3} key={index} alignItems="center">
                <Grid item xs={1}>
                    {singleChoice ? (
                        <Radio
                            checked={answer.isCorrect}
                            onChange={() => onAnswerChange(answer)}
                        />
                    ) : (
                        <Checkbox
                            checked={answer.isCorrect}
                            onChange={(e) => onAnswerChange({...answer, isCorrect: e.target.checked})}
                        />
                    )}
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        placeholder="Введите вариант ответа"
                        fullWidth
                        variant="standard"
                        value={answer.optionText}
                        onChange={(e) => onAnswerChange({...answer, optionText: e.target.value})}
                    />
                </Grid>
                {displayActions &&
                    <Grid item xs={1}>
                        <IconButton onClick={() => onDeleteAnswer(answer.id)}>
                            <DeleteOutlineOutlined/>
                        </IconButton>
                    </Grid>}
            </Grid>
        ))}
        {displayActions && onAddAnswer && (
            <Button variant="outlined" sx={{mt: 2}} onClick={onAddAnswer}>
                Добавить ответ
            </Button>
        )}
    </Box>
);
