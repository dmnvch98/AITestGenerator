import React, {useEffect} from 'react';
import {Modal, Box, Typography, TextField, Button} from '@mui/material';
import {useGenerateTestStore} from "../../store/tests/generateTestStore";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

export const GenTestModal: React.FC<ModalFormProps> = ({ open, onClose, onSubmit }) => {
    const MAX_QUESTIONS = 20;
    const MAX_ANSWERS = 5;
    const {
        maxQuestionsCount,
        minAnswersCount,
        temperature,
        topP,
        setQuestions,
        setAnswers,
        setTemperature,
        setTopP,
    } = useGenerateTestStore();

    useEffect(() => {
        if (!open) {
            clearFields();
        }
    }, [open]);

    const handleQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(MAX_QUESTIONS, Math.max(1, parseInt(event.target.value, 10) || 1));
        setQuestions(value);
    };

    const handleAnswersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(MAX_ANSWERS, Math.max(1, parseInt(event.target.value, 10) || 1));
        setAnswers(value);
    };

    const handleTemperatureChange = (_event: Event, newValue: number | number[]) => {
        setTemperature(newValue as number);
    };

    const handleTopPChange = (_event: Event, newValue: number | number[]) => {
        setTopP(newValue as number);
    };

    const clearFields = () => {
        setQuestions(10);
        setAnswers(4);
        setTemperature(0.5);
        setTopP(0.8);
    }

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

                <TextField
                    label={`Максимальное число вопросов (${MAX_QUESTIONS} макс.)`}
                    type="number"
                    value={maxQuestionsCount}
                    onChange={handleQuestionsChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 0, max: 50 }}
                />

                <TextField
                    label={`Максимальное число вариантов ответов (${MAX_ANSWERS} макс.)`}
                    type="number"
                    value={minAnswersCount}
                    onChange={handleAnswersChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 0, max: 8 }}
                />

                <Button onClick={onSubmit} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Сгенерировать
                </Button>
            </Box>
        </Modal>
    );
};
