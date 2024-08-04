import React from "react";
import { Box, FormControl, FormControlLabel, FormGroup, Paper, Slider, Switch, Typography } from "@mui/material";
import useTextSettingsStore from "../../../store/tests/textSettingsStore";
import ReactToPrint from "react-to-print";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

interface TestPrintActionsProps {
    printRef: React.RefObject<HTMLDivElement>;
}

export const PrintTestSettings: React.FC<TestPrintActionsProps> = ({ printRef }) => {
    const {
        titleFontSize,
        setTitleFontSize,
        questionFontSize,
        setQuestionFontSize,
        answerFontSize,
        setAnswerFontSize,
        titleFontWeight,
        setTitleFontWeight,
        questionFontWeight,
        setQuestionFontWeight,
        lineHeight,
        setLineHeight,
        showAnswers,
        setShowAnswers,
        showHeader,
        setShowHeader
    } = useTextSettingsStore();

    const navigate = useNavigate();

    const handleShowAnswers = () => {
        setShowAnswers(!showAnswers);
    }

    const handleShowHeader = () => {
        setShowHeader(!showHeader);
    }

    const handleExit = () => {
        navigate("/tests");
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Paper sx={{ p: 2, width: '100%', maxWidth: 400, textAlign: 'start', mb: 2 }} elevation={2}>
                <ReactToPrint
                    trigger={() => <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mb: 2 }}
                    >Печать
                    </Button>}
                    content={() => printRef.current}
                />
                <Button variant="outlined" color='error' fullWidth onClick={handleExit}>Отменить</Button>
            </Paper>
            <Paper sx={{ p: 2, width: '100%', maxWidth: 400, textAlign: 'start' }} elevation={2}>
                <Box>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={showAnswers} onChange={handleShowAnswers} />}
                            label="Показать ответы"
                        />
                    </FormGroup>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={showHeader} onChange={handleShowHeader} />}
                            label="Шапка теста"
                        />
                    </FormGroup>

                    <Typography variant="subtitle1" gutterBottom fontWeight="600">Размер</Typography>
                    <FormControl fullWidth sx={{display: showHeader ? 'block' : 'none'}}>
                        <Typography>Шапка теста</Typography>
                        <Slider
                            value={titleFontSize}
                            onChange={(e, newValue) => setTitleFontSize(newValue as number)}
                            step={1}
                            min={14}
                            max={20}
                            valueLabelDisplay="auto"
                            marks
                            size="small"
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <Typography>Вопрос</Typography>
                        <Slider
                            value={questionFontSize}
                            onChange={(e, newValue) => setQuestionFontSize(newValue as number)}
                            step={1}
                            min={12}
                            max={16}
                            valueLabelDisplay="auto"
                            marks
                            size="small"
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <Typography>Ответ</Typography>
                        <Slider
                            value={answerFontSize}
                            onChange={(e, newValue) => setAnswerFontSize(newValue as number)}
                            step={1}
                            min={12}
                            max={16}
                            valueLabelDisplay="auto"
                            marks
                            size="small"
                        />
                    </FormControl>
                </Box>

                <Box>
                    <Typography variant="subtitle1" gutterBottom fontWeight="600">Жирность</Typography>
                    <FormControl fullWidth sx={{display: showHeader ? 'block' : 'none'}}>
                        <Typography>Заголовок</Typography>
                        <Slider
                            value={titleFontWeight}
                            onChange={(e, newValue) => setTitleFontWeight(newValue as number)}
                            step={100}
                            min={400}
                            max={600}
                            valueLabelDisplay="auto"
                            marks
                            size="small"
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <Typography>Вопрос</Typography>
                        <Slider
                            value={questionFontWeight}
                            onChange={(e, newValue) => setQuestionFontWeight(newValue as number)}
                            step={100}
                            min={400}
                            max={600}
                            valueLabelDisplay="auto"
                            marks
                            size="small"
                        />
                    </FormControl>
                </Box>
                <Box>
                    <Typography variant="subtitle1" gutterBottom fontWeight="600">Высота отступов</Typography>
                    <FormControl fullWidth>
                        <Slider
                            value={lineHeight}
                            onChange={(e, newValue) => setLineHeight(newValue as number)}
                            step={1}
                            min={1}
                            max={10}
                            valueLabelDisplay="auto"
                            marks
                            size="small"
                        />
                    </FormControl>
                </Box>
            </Paper>
        </Box>
    );
};
