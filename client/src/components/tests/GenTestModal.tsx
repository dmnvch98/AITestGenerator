import React, {useEffect, useState} from 'react';
import {TextField, Button, DialogTitle, IconButton, DialogContent} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import DialogActions from "@mui/material/DialogActions";
interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (maxQuestionsCount: number, minAnswersCount: number, correctAnswersValue: number) => void;
}

export const GenTestModal: React.FC<ModalFormProps> = ({ open, onClose, onSubmit }) => {
    const MAX_QUESTIONS = 20;
    const MIN_QUESTIONS = 1;
    const MAX_ANSWERS = 5;
    const MIN_ANSWERS = 2;

    const [questionsInput, setQuestionsInput] = useState('10');
    const [answersInput, setAnswersInput] = useState('4');
    const [correctAnswersInput, setCorrectAnswersInput] = useState('1');
    const [errors, setErrors] = useState({ questions: '', answers: '', correctAnswers: '' });

    useEffect(() => {
        if (!open) {
            setQuestionsInput('10');
            setAnswersInput('4');
            setCorrectAnswersInput('1');
        }
    }, [open]);

    const handleQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionsInput(event.target.value);
    };

    const handleAnswersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswersInput(event.target.value);
    };

    const handleCorrectAnswersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCorrectAnswersInput(event.target.value);
    };

    const validateInputs = (): { questionsValue: number, answersValue: number, correctAnswersValue: number, valid: boolean } => {
        let valid = true;
        const errors = { questions: '', answers: '', correctAnswers: '' };

        const questionsValue = parseInt(questionsInput, 10);
        const answersValue = parseInt(answersInput, 10);
        const correctAnswersValue = parseInt(correctAnswersInput, 10);

        if (isNaN(questionsValue) || questionsValue < MIN_QUESTIONS || questionsValue > MAX_QUESTIONS) {
            errors.questions = `Введите число от ${MIN_QUESTIONS} до ${MAX_QUESTIONS}`;
            valid = false;
        }

        if (isNaN(answersValue) || answersValue < MIN_ANSWERS || answersValue > MAX_ANSWERS) {
            errors.answers = `Введите число от ${MIN_ANSWERS} до ${MAX_ANSWERS}`;
            valid = false;
        }

        if (isNaN(correctAnswersValue) || correctAnswersValue < 1 || correctAnswersValue >= answersValue) {
            errors.correctAnswers = `Количество правильных ответов должно быть от 1 до ${answersValue - 1}`;
            valid = false;
        }

        setErrors(errors);
        return { questionsValue, answersValue, correctAnswersValue, valid };
    };

    const handleSubmit = () => {
        const { questionsValue, answersValue, correctAnswersValue, valid } = validateInputs();
        if (valid) {
            onSubmit(questionsValue, answersValue, correctAnswersValue);
        }
    };

    const isSubmitDisabled = !questionsInput.trim() || !answersInput.trim() || !correctAnswersInput.trim();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            sx={{ '.MuiPaper-root': { width: '400px' } }}
        >
            <DialogTitle>
                Параметры генерации
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    label={`Количество вопросов (${MAX_QUESTIONS} макс.)`}
                    value={questionsInput}
                    onChange={handleQuestionsChange}
                    error={!!errors.questions}
                    helperText={errors.questions}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label={`Количество ответов (${MAX_ANSWERS} макс.)`}
                    value={answersInput}
                    onChange={handleAnswersChange}
                    error={!!errors.answers}
                    helperText={errors.answers}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label={`Количество правильных ответов`}
                    value={correctAnswersInput}
                    onChange={handleCorrectAnswersChange}
                    error={!!errors.correctAnswers}
                    helperText={errors.correctAnswers}
                    fullWidth
                    margin="normal"
                />

            </DialogContent>
            <DialogActions sx={{p: 2}}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    fullWidth
                >
                    Отменить
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={isSubmitDisabled}
                >
                    Сгенерировать
                </Button>
            </DialogActions>
        </Dialog>
    );
};
