import React, {useEffect, useState} from "react";
import {CreateTestRequestDto, Question, UserTest, useTestStore} from "../../store/tests/testStore";
import {useNavigate} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
    Alert,
    Paper,
    Snackbar,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Pagination,
    Tooltip,
    PaginationItem
} from "@mui/material";
import {QuestionListView, QuestionPaginatedView} from "./TestDisplayMode";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { v4 as uuidv4 } from 'uuid';

interface TestFormProps {
    initialTest?: UserTest;
    isEditMode: boolean;
}

const newTest = {
    title: '',
    questions: [
        {
            id: uuidv4(),
            questionText: '',
            answerOptions: [
                {
                    id: uuidv4(),
                    optionText: '',
                    isCorrect: false
                }
            ]
        }
    ]
};

export const TestForm: React.FC<TestFormProps> = ({initialTest, isEditMode}) => {
    const navigate = useNavigate();

    const [lastSavedTest, setLastSavedTest] = useState<UserTest | null>(null);
    const [localTest, setLocalTest] = useState<UserTest | CreateTestRequestDto>(() => {
        return isEditMode && initialTest ? {...initialTest} : newTest;
    });
    const [testTitleError, setTestTitleError] = useState<string | null>(null);
    const [invalidQuestions, setInvalidQuestions] = useState<{ index: number; message: string }[]>([]);
    const {alerts, clearAlerts, deleteAlert, setAlert, upsert} = useTestStore();
    const [hasSaved, setHasSaved] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'list' | 'paginated'>('paginated');

    useEffect(() => {
        if (isEditMode && initialTest && !hasSaved) {
            setLocalTest({...initialTest});
        }
    }, [initialTest, hasSaved, isEditMode]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalTest({...localTest, title: e.target.value});
    };

    const handleAddQuestion = () => {
        if (localTest) {
            const newQuestion: Question = {
                id: uuidv4(),
                questionText: "",
                answerOptions: [],
            };
            const updatedQuestions = [...localTest.questions, newQuestion];
            setLocalTest({...localTest, questions: updatedQuestions});
            setCurrentQuestionIndex(updatedQuestions.length - 1); // Switch to the new question if in paginated mode
        }
    };

    const handleQuestionChange = (updatedQuestion: Question) => {
        const updatedQuestions = localTest.questions.map((q: Question) =>
            q.id === updatedQuestion.id ? updatedQuestion : q
        );
        setLocalTest({...localTest, questions: updatedQuestions});
    };

    const handleDeleteQuestion = (id: string) => {
        const updatedQuestions = localTest.questions.filter((q: Question) => q.id !== id);
        setLocalTest({...localTest, questions: updatedQuestions});

        if (currentQuestionIndex >= updatedQuestions.length) {
            setCurrentQuestionIndex(updatedQuestions.length > 0 ? updatedQuestions.length - 1 : 0);
        }
    };

    const handleSave = () => {
        if (localTest && validateTest()) {
            upsert(localTest).then(resp => {
                if (resp != null) {
                    setHasSaved(true);
                    setLocalTest(resp);
                    setLastSavedTest(resp);
                }
            });
        }
    };

    const validateTest = (): boolean => {
        if (localTest?.title && !localTest?.title.trim()) {
            setTestTitleError("Заголовок теста не должен быть пустым");
            return false;
        } else {
            setTestTitleError(null);
        }

        if (localTest.questions.length < 1) {
            setAlert([{id: Date.now(), message: 'Тест должен содержить минимум один вопрос', severity: 'error'}]);
            return false;
        }

        const invalidQuestions = localTest?.questions
            .map((q, index) => {
                if (!q.questionText) {
                    return {index, message: "Вопрос не должен быть пустым"};
                }
                if (q.answerOptions.length < 2) {
                    return {index, message: "Вопрос должен иметь минимум 2 ответа"};
                }
                if (!q.answerOptions.some((a) => a.isCorrect)) {
                    return {index, message: "Вопрос должен иметь минимум один правильный ответ"};
                }
                if (q.answerOptions.some((a) => a.optionText === "")) {
                    return {index, message: "Ответ не должен быть пустым"};
                }
                return null;
            })
            .filter((item) => item !== null) as { index: number; message: string }[];

        setInvalidQuestions(invalidQuestions);

        if (invalidQuestions.length > 0) {
            setAlert([{id: Date.now(), message: 'Пожалуйста, исправьте ошибки в тесте', severity: 'error'}]);
            setCurrentQuestionIndex((invalidQuestions[0].index));
            return false;
        }

        return true;
    };

    const handleReset = () => {
        const resetTest = lastSavedTest ?? initialTest ?? newTest;
        setLocalTest(resetTest);
        setCurrentQuestionIndex(0);
        setInvalidQuestions([]);
    };

    return (
        <Box display="flex" flexDirection="row" position="relative">
            <Box flexGrow={1} mr="250px">
                <Paper sx={{minHeight: '100px'}}>
                    <Box sx={{ml: 4, mr: 4, pt: 2}}>
                            <TextField
                                label="Заголовок теста"
                                placeholder="Введите заголовок теста"
                                fullWidth
                                multiline
                                value={localTest?.title || ""}
                                variant="standard"
                                onChange={handleTitleChange}
                                sx={{
                                    "& .MuiInputBase-input": {
                                        fontWeight: 600,
                                        fontSize: "22px",
                                    }
                                }}
                                error={!!testTitleError}
                                helperText={testTitleError}
                            />

                    </Box>

                    {viewMode === 'list' ? (
                        <QuestionListView
                            questions={localTest.questions}
                            onQuestionChange={handleQuestionChange}
                            onDelete={handleDeleteQuestion}
                            invalidQuestions={invalidQuestions}
                        />
                    ) : (
                        <QuestionPaginatedView
                            questions={localTest.questions}
                            currentQuestionIndex={currentQuestionIndex}
                            onQuestionChange={handleQuestionChange}
                            onDelete={handleDeleteQuestion}
                            onSelectQuestion={setCurrentQuestionIndex}
                            invalidQuestions={invalidQuestions}
                        />
                    )}
                </Paper>
            </Box>

            <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
                <Paper sx={{maxWidth: 230, p: 2, position: "fixed"}}>
                    <FormControl fullWidth sx={{mb: 3}}>
                        <InputLabel id="view-mode-select-label">Режим отображения</InputLabel>
                        <Select
                            size="small"
                            labelId="view-mode-select-label"
                            value={viewMode}
                            label="Режим отображения"
                            onChange={(e) => setViewMode(e.target.value as 'list' | 'paginated')}
                        >
                            <MenuItem value="list">Список</MenuItem>
                            <MenuItem value="paginated">Постранично</MenuItem>
                        </Select>
                    </FormControl>

                    <Divider sx={{mb: 3}}/>

                    {/* Action buttons */}
                    <Button sx={{mb: 2, width: "100%"}} variant="contained" onClick={handleSave}>
                        Сохранить
                    </Button>
                    <Button sx={{mb: 2, width: "100%"}} variant="outlined" color="primary" onClick={handleAddQuestion}>
                        Добавить вопрос
                    </Button>
                    <Tooltip title="Сбрасывает состояние до последнего сохраненного" enterDelay={500} leaveDelay={200}>
                        <span>
                        <Button sx={{mb: 2, width: "100%"}} variant="outlined" color="secondary"
                                onClick={handleReset}>
                            Сбросить
                        </Button>
                            </span>
                    </Tooltip>
                    <Button sx={{width: "100%"}} variant="outlined" color="secondary"
                            onClick={() => navigate("/tests")}>
                        Выйти
                    </Button>
                    {viewMode === 'paginated' && (
                        <>
                            <Box sx={{mt: 3}}>
                                <Divider sx={{mb: 3}}/>
                                <Typography align="left" variant="subtitle2" sx={{mb: 1}}>Номер вопроса:</Typography>
                                <Pagination
                                    count={localTest.questions.length}
                                    page={currentQuestionIndex + 1}
                                    onChange={(_, page) => setCurrentQuestionIndex(page - 1)}
                                    variant="outlined"
                                    shape="rounded"
                                    sx={{display: 'flex', justifyContent: 'center'}}
                                    hidePrevButton
                                    hideNextButton
                                    boundaryCount={localTest.questions.length}
                                    siblingCount={localTest.questions.length}
                                    renderItem={(item) => (
                                        <PaginationItem
                                            {...item}
                                            sx={{
                                                ...(invalidQuestions.map(q => q.index + 1).includes(item.page as number) && {
                                                    backgroundColor: 'red',
                                                    color: 'black',
                                                })
                                            }}
                                        />
                                    )}
                                />
                            </Box>
                        </>
                    )}
                </Paper>

            </Box>


            <Snackbar
                open={alerts.length > 0}
                autoHideDuration={6000}
                onClose={clearAlerts}
            >
                <Box sx={{maxWidth: '400px'}}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} severity={alert.severity} sx={{mb: 0.5, textAlign: 'left'}}
                               onClose={() => deleteAlert(alert)}>
                            <span dangerouslySetInnerHTML={{__html: alert.message}}/>
                        </Alert>
                    ))}
                </Box>
            </Snackbar>
        </Box>
    );
};
