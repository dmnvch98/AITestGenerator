import React, { useEffect, useState } from 'react';
import {Modal, Box, Typography, TextField, Button, Alert} from '@mui/material';
import { useGenerateTestStore } from "../../store/tests/generateTestStore";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const GenTestModal: React.FC<ModalFormProps> = ({ open, onClose, onSubmit }) => {
    const MAX_QUESTIONS = 20;
    const MAX_ANSWERS = 5;

    const { setQuestions, setAnswers, minAnswersCount, maxQuestionsCount } = useGenerateTestStore();

    const [questionsInput, setQuestionsInput] = useState('10');
    const [answersInput, setAnswersInput] = useState('4');
    const [errors, setErrors] = useState({ questions: '', answers: '' });

    useEffect(() => {
        if (!open) {
            clearFields();
        }
    }, [open]);

    const handleQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestionsInput(event.target.value);
    };

    const handleAnswersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswersInput(event.target.value);
    };

    const validateInputs = () => {
        let valid = true;
        const errors = { questions: '', answers: '' };

        const questionsValue = parseInt(questionsInput, 10);
        const answersValue = parseInt(answersInput, 10);

        if (isNaN(questionsValue) || questionsValue < 1 || questionsValue > MAX_QUESTIONS) {
            errors.questions = `Введите число от 1 до ${MAX_QUESTIONS}`;
            valid = false;
        }

        if (isNaN(answersValue) || answersValue < 1 || answersValue > MAX_ANSWERS) {
            errors.answers = `Введите число от 1 до ${MAX_ANSWERS}`;
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleSubmit = () => {
        if (validateInputs()) {
            const questionsValue = parseInt(questionsInput, 10);
            const answersValue = parseInt(answersInput, 10);

            setQuestions(questionsValue);
            setAnswers(answersValue);
        }
        console.log(minAnswersCount, maxQuestionsCount);
        onSubmit();
    };

    const clearFields = () => {
        setQuestionsInput('10');
        setAnswersInput('4');
        setErrors({ questions: '', answers: '' });
    };

    const isSubmitDisabled = !questionsInput.trim() || !answersInput.trim();

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: '8px',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Параметры генерации
                </Typography>

                <Alert severity="info" icon={false} sx={{ mb: 1 }}>
                    <Box textAlign="left">
                        Вы можете установить собственные допустимые значения
                    </Box>
                </Alert>

                <TextField
                    label={`Максимальное число вопросов (${MAX_QUESTIONS} макс.)`}
                    value={questionsInput}
                    onChange={handleQuestionsChange}
                    error={!!errors.questions}
                    helperText={errors.questions}
                    fullWidth
                    margin="normal"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />

                <TextField
                    label={`Максимальное число вариантов ответов (${MAX_ANSWERS} макс.)`}
                    value={answersInput}
                    onChange={handleAnswersChange}
                    error={!!errors.answers}
                    helperText={errors.answers}
                    fullWidth
                    margin="normal"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />

                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={isSubmitDisabled}
                >
                    Сгенерировать
                </Button>
            </Box>
        </Modal>
    );
};
