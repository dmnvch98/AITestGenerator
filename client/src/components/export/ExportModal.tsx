import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle, InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {useExportStore} from "../../store/tests/exportStore";

export const ExportModal = () => {
    const {
        exportFormat, setExportFormat,
        questionsLabel, setQuestionsLabel,
        questionTextLabel, setQuestionTextLabel,
        answerOptionsLabel, setAnswerOptionsLabel,
        optionTextLabel, setOptionTextLabel,
        isCorrectLabel, setIsCorrectLabel,
        toggleModelOpen, exportTest
    } = useExportStore();

    const handleExport = () => {
        exportTest();
        toggleModelOpen();
    }

    return (
        <Box sx={{pb:2}}>
            <DialogTitle>Export</DialogTitle>
            <DialogContent>
                <InputLabel id="export-format-label">Export Format</InputLabel>
                <Select
                    labelId="export-format-label"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    fullWidth
                    variant="outlined"
                    label="Export Format"
                >
                    <MenuItem value="CSV">CSV</MenuItem>
                    <MenuItem value="JSON">JSON</MenuItem>
                    <MenuItem value="XML">XML</MenuItem>
                </Select>

                <TextField
                    label="Questions Label"
                    variant="outlined"
                    fullWidth
                    value={questionsLabel}
                    onChange={(e) => setQuestionsLabel(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Question Text Label"
                    variant="outlined"
                    fullWidth
                    value={questionTextLabel}
                    onChange={(e) => setQuestionTextLabel(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Answer Options Label"
                    variant="outlined"
                    fullWidth
                    value={answerOptionsLabel}
                    onChange={(e) => setAnswerOptionsLabel(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Option Text Label"
                    variant="outlined"
                    fullWidth
                    value={optionTextLabel}
                    onChange={(e) => setOptionTextLabel(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Is Correct Label"
                    variant="outlined"
                    fullWidth
                    value={isCorrectLabel}
                    onChange={(e) => setIsCorrectLabel(e.target.value)}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleModelOpen}>Cancel</Button>
                <Button variant="contained" onClick={handleExport}>Export</Button>
            </DialogActions>
        </Box>

    )
}