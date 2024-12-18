import React from "react";
import {Box, Grid, TextField, IconButton, Checkbox, Radio, Button} from "@mui/material";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { AnswerOption } from "../../../store/tests/testStore";
import Typography from "@mui/material/Typography";

interface AnswerListProps {
    answerOptions: AnswerOption[];
    onAnswerChange: (updatedOption: AnswerOption) => void;
    onDeleteAnswer: (id: string) => void;
    onAddAnswer?: () => void;
    correctAnswerChanged?: (updatedOption: AnswerOption) => void;
    singleChoice?: boolean;
    displayActions: boolean;
    errorMessage?: string;
}

export const AnswerList: React.FC<AnswerListProps> = ({
                                                          answerOptions,
                                                          onAnswerChange,
                                                          onDeleteAnswer,
                                                          onAddAnswer,
                                                          singleChoice,
                                                          displayActions,
                                                          correctAnswerChanged,
                                                          errorMessage
                                                      }) => (
    <Box>
        <Grid container spacing={3} alignItems="center" sx={{ mb: 1 }}>
            <Grid item xs={1}>
                <Typography fontWeight="bold">Верно</Typography>
            </Grid>
            <Grid item xs={10}>
                <Typography align="left" fontWeight="bold">Вариант ответа</Typography>
            </Grid>
            {displayActions && <Grid item xs={1} />}
        </Grid>
        {answerOptions.map((answer) => (
            <Grid container spacing={3} key={answer.id} alignItems="center">
                <Grid item xs={1}>
                    {singleChoice ? (
                        <Radio
                            checked={answer.isCorrect}
                            onChange={(e) => correctAnswerChanged && correctAnswerChanged({ ...answer, isCorrect: e.target.checked })}
                        />
                    ) : (
                        <Checkbox
                            checked={answer.isCorrect}
                            onChange={(e) => onAnswerChange({ ...answer, isCorrect: e.target.checked })}
                        />
                    )}
                </Grid>
                <Grid item xs={10}>
                    <TextField
                        placeholder="Введите вариант ответа"
                        fullWidth
                        variant="standard"
                        value={answer.optionText}
                        onChange={(e) => onAnswerChange({ ...answer, optionText: e.target.value })}
                    />
                </Grid>
                {displayActions && (
                    <Grid item xs={1}>
                        <IconButton onClick={() => onDeleteAnswer(answer.id)}>
                            <DeleteOutlineOutlined />
                        </IconButton>
                    </Grid>
                )}
            </Grid>
        ))}
        <Typography align={"left"} variant="body2" sx={{mt: 2}} color="error">
            {errorMessage}
        </Typography>
        {displayActions && onAddAnswer && (
            <Button variant="outlined" sx={{ mt: 2 }} onClick={onAddAnswer}>
                Добавить ответ
            </Button>
        )}
    </Box>
);
