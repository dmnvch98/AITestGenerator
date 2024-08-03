import React from "react";
import { Box, FormControl, Paper, Slider, Typography } from "@mui/material";
import useTextSettingsStore from "../../../store/tests/textSettingsStore";
import ReactToPrint from "react-to-print";
import Button from "@mui/material/Button";

interface TestPrintActionsProps {
    printRef: React.RefObject<HTMLDivElement>;
}

const TestPrintActions: React.FC<TestPrintActionsProps> = ({ printRef }) => {
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
    } = useTextSettingsStore();

    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
            <Paper sx={{ maxWidth: 230, p: 2, position: 'fixed'}} elevation={2}>

                <Box mb={2}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="600">Размер</Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography>Заголовок</Typography>
                        <Slider
                            value={titleFontSize}
                            onChange={(e, newValue) => setTitleFontSize(newValue as number)}
                            step={1}
                            min={14}
                            max={20}
                            valueLabelDisplay="auto"
                            marks
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography>Вопрос</Typography>
                        <Slider
                            value={questionFontSize}
                            onChange={(e, newValue) => setQuestionFontSize(newValue as number)}
                            step={1}
                            min={12}
                            max={16}
                            valueLabelDisplay="auto"
                            marks
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography>Ответ</Typography>
                        <Slider
                            value={answerFontSize}
                            onChange={(e, newValue) => setAnswerFontSize(newValue as number)}
                            step={1}
                            min={12}
                            max={16}
                            valueLabelDisplay="auto"
                            marks
                        />
                    </FormControl>
                </Box>

                <Box mb={2}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="600">Жирность</Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography>Заголовок</Typography>
                        <Slider
                            value={titleFontWeight}
                            onChange={(e, newValue) => setTitleFontWeight(newValue as number)}
                            step={100}
                            min={400}
                            max={600}
                            valueLabelDisplay="auto"
                        />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Typography>Вопрос</Typography>
                        <Slider
                            value={questionFontWeight}
                            onChange={(e, newValue) => setQuestionFontWeight(newValue as number)}
                            step={100}
                            min={400}
                            max={600}
                            valueLabelDisplay="auto"
                        />
                    </FormControl>
                    <Box mt={2}>
                        <ReactToPrint
                            trigger={() => <Button fullWidth variant="contained" color="primary">Печать</Button>}
                            content={() => printRef.current}
                        />

                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default TestPrintActions;
