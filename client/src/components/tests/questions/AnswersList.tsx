import React, {useState} from "react";
import {Box, Grid, TextField, IconButton, Checkbox, Radio, Button} from "@mui/material";
import {DeleteOutlineOutlined} from "@mui/icons-material";
import {AnswerOption} from "../../../store/tests/testStore";
import Typography from "@mui/material/Typography";
import {QuestionType} from "../../../store/tests/types";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogContent from "@mui/material/DialogContent";
import QuestionsExample from "./example/QuestionsExample";

interface AnswerListProps {
    answerOptions: AnswerOption[];
    onAnswerChange: (updatedOption: AnswerOption) => void;
    onDeleteAnswer: (id: number) => void;
    onAddAnswer?: () => void;
    correctAnswerChanged?: (updatedOption: AnswerOption) => void;
    singleChoice?: boolean;
    questionType?: QuestionType;
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
                                                          errorMessage,
                                                          questionType
                                                      }) => {
    const [showExample, setShowExample] = useState(false);

    const handleCloseExample = () => {
        setShowExample(false);
    }

    const handleOpenExample = () => {
        setShowExample(true);
    }

    return (
        <Box>
            <Grid container spacing={3} alignItems="center" sx={{mb: 1}}>
                <Grid item xs={1}>
                    <Typography fontWeight="bold">Верно</Typography>
                </Grid>
                <Grid item xs={10}>
                    <Typography align="left" fontWeight="bold">Вариант ответа</Typography>
                </Grid>
                {displayActions && <Grid item xs={1}/>}
            </Grid>
            {answerOptions.map((answer) => (
                <Grid container spacing={3} key={answer.id} alignItems="center">
                    <Grid item xs={1}>
                        {singleChoice ? (
                            <Radio
                                checked={answer.correct}
                                onChange={(e) => correctAnswerChanged && correctAnswerChanged({
                                    ...answer,
                                    correct: e.target.checked
                                })}
                            />
                        ) : (
                            <Checkbox
                                checked={answer.correct}
                                onChange={(e) => onAnswerChange({...answer, correct: e.target.checked})}
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
                    {displayActions && (
                        <Grid item xs={1}>
                            <IconButton onClick={() => onDeleteAnswer(answer.id)}>
                                <DeleteOutlineOutlined/>
                            </IconButton>
                        </Grid>
                    )}
                </Grid>
            ))}
            {errorMessage && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" color="error">
                        {errorMessage + ' '}
                        <Box
                            component="span"
                            onClick={handleOpenExample}
                            sx={{
                                fontWeight: "bold",
                                cursor: 'pointer',
                                textDecoration: 'underline',
                            }}
                        >
                            Открыть Пример
                        </Box>
                    </Typography>
                </Box>
            )}


            {displayActions && onAddAnswer && (
                <Button variant="outlined" sx={{mt: 2}} onClick={onAddAnswer}>
                    Добавить ответ
                </Button>
            )}

            <Dialog
                open={showExample}
                onClose={handleCloseExample}
                fullWidth
                maxWidth="md"
            >
                <IconButton
                    aria-label="close"
                    onClick={handleCloseExample}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent>
                    <QuestionsExample defaultQuestionType={questionType}/>
                </DialogContent>

            </Dialog>
        </Box>
    );
}