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
import {UserTest} from "../../store/tests/testStore";

interface ExportModalProps {
    test: UserTest | undefined;
}

export const ExportModal = ({ test }: ExportModalProps) => {
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
        if (test) {
            exportTest(test);
            toggleModelOpen();
        }
    }

    return (
        <Box sx={{pb:2}}>
            <DialogTitle>Экспорт</DialogTitle>
            <DialogContent>
                <InputLabel id="export-format-label">Формат файла</InputLabel>
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
                    label="Метка списка вопросов"
                    variant="outlined"
                    fullWidth
                    value={questionsLabel}
                    onChange={(e) => setQuestionsLabel(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Метка текста вопроса"
                    variant="outlined"
                    fullWidth
                    value={questionTextLabel}
                    onChange={(e) => setQuestionTextLabel(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Метка списка ответов"
                    variant="outlined"
                    fullWidth
                    value={answerOptionsLabel}
                    onChange={(e) => setAnswerOptionsLabel(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Метка текста ответа"
                    variant="outlined"
                    fullWidth
                    value={optionTextLabel}
                    onChange={(e) => setOptionTextLabel(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Метка корректности ответа"
                    variant="outlined"
                    fullWidth
                    value={isCorrectLabel}
                    onChange={(e) => setIsCorrectLabel(e.target.value)}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleModelOpen}>Отменить</Button>
                <Button variant="contained" onClick={handleExport}>Экспорт</Button>
            </DialogActions>
        </Box>

    )
}
