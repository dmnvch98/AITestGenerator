import React from 'react';
import {Modal, Box, Typography, TextField, Slider, Button, Tooltip} from '@mui/material';
import {useGenerateTestStore} from "../../store/tests/generateTestStore";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface ModalFormProps {
    open: boolean;
    handleClose: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ open, handleClose }) => {
    const {
        questions,
        answers,
        temperature,
        topP,
        setQuestions,
        setAnswers,
        setTemperature,
        setTopP,
    } = useGenerateTestStore();

    const handleQuestionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(50, Math.max(0, parseInt(event.target.value, 10) || 0));
        setQuestions(value);
    };

    const handleAnswersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(8, Math.max(0, parseInt(event.target.value, 10) || 0));
        setAnswers(value);
    };

    const handleTemperatureChange = (_event: Event, newValue: number | number[]) => {
        setTemperature(newValue as number);
    };

    const handleTopPChange = (_event: Event, newValue: number | number[]) => {
        setTopP(newValue as number);
    };

    return (
        <Modal open={open} onClose={handleClose}>
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
                    label="Максимальное число вопросов (50 макс.)"
                    type="number"
                    value={questions}
                    onChange={handleQuestionsChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 0, max: 50 }}
                />

                <TextField
                    label="Максимальное число вариантов ответов (8 макс.)"
                    type="number"
                    value={answers}
                    onChange={handleAnswersChange}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 0, max: 8 }}
                />

                <Box display="flex">
                    <Typography gutterBottom>Температура</Typography>
                    <Tooltip title="Температура контролирует степень случайности в ответах: значение 0 делает ответы более предсказуемыми, а значение 1 – более случайными и креативными.">
                        <InfoOutlinedIcon sx={{ ml: 1, color:'#999' }} fontSize="small"/>
                    </Tooltip>
                </Box>
                <Slider
                    marks
                    value={temperature}
                    onChange={handleTemperatureChange}
                    min={0}
                    max={1}
                    step={0.1}
                    valueLabelDisplay="auto"
                />

                <Box display="flex">
                    <Typography gutterBottom>Top P</Typography>
                    <Tooltip title="Top P ограничивает выбор слов: при значении 1 учитываются все возможные слова, а при значениях ближе к 0 – только самые вероятные слова">
                        <InfoOutlinedIcon sx={{ ml: 1, color:'#999' }} fontSize="small"/>
                    </Tooltip>
                </Box>
                <Slider
                    marks
                    value={topP}
                    onChange={handleTopPChange}
                    min={0}
                    max={1}
                    step={0.1}
                    valueLabelDisplay="auto"
                />

                <Button onClick={handleClose} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Сгенерировать
                </Button>
            </Box>
        </Modal>
    );
};

export default ModalForm;