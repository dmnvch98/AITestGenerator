import React, { useEffect, useRef, useState } from "react";
import {CreateTestRequestDto, Question, UserTest, useTestStore} from "../../store/tests/testStore";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import QuestionEdit from "../../components/tests/questions/QuestionEdit";
import { Alert, Paper, Snackbar } from "@mui/material";

interface TestFormProps<T> {
    initialTest?: T;
    onSave: (test: T) => void;
    isEditMode: boolean;
}

export const TestForm = <T extends UserTest | CreateTestRequestDto>({
                                                                        initialTest,
                                                                        onSave,
                                                                        isEditMode
                                                                    }: TestFormProps<T>) => {
    const navigate = useNavigate();

    const [localTest, setLocalTest] = useState<T | null>(initialTest || null);
    const [testTitleError, setTestTitleError] = useState<string | null>(null);
    const [invalidQuestions, setInvalidQuestions] = useState<{ index: number; message: string }[]>([]);
    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const { alerts, clearAlerts, deleteAlert, setAlert} = useTestStore();
    const [hasSaved, setHasSaved] = useState(false);


    useEffect(() => {
        if (initialTest && !hasSaved) {
            setLocalTest({ ...initialTest });
        }
    }, [initialTest, hasSaved]);

    useEffect(() => {
        return () => {removeLocalIds()};
    }, []);

    const handleReset = () => {
        if (initialTest) {
            setInvalidQuestions([]);
            setLocalTest(cloneDeep(initialTest));
        }
    };

    const cloneDeep = (obj: any) => {
        return JSON.parse(JSON.stringify(obj));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (localTest) {
            setLocalTest({ ...localTest, title: e.target.value });
        }
    };

    const handleAddQuestion = () => {
        if (localTest) {
            const newQuestion: Question = {
                id: localTest.questions.length + 1,
                questionText: "",
                answerOptions: [],
            };
            const updatedQuestions = [...localTest.questions, newQuestion];
            setLocalTest({ ...localTest, questions: updatedQuestions });
        }
    };

    const handleQuestionChange = (updatedQuestion: Question) => {
        if (localTest) {
            const updatedQuestions = localTest.questions.map((q: Question) =>
                q.id === updatedQuestion.id ? updatedQuestion : q
            );
            setLocalTest({ ...localTest, questions: updatedQuestions });
        }
    };

    const handleDeleteQuestion = (id: number) => {
        if (localTest) {
            const updatedQuestions = localTest.questions.filter((q: Question) => q.id !== id);
            setLocalTest({ ...localTest, questions: updatedQuestions });
        }
    };

    const handleSave = () => {
        if (localTest && validateTest()) {
            // removeLocalIds();
            onSave(localTest);
            setHasSaved(true);
        }
    };

    const removeLocalIds = () => {
        if (localTest && "questions" in localTest) {
            localTest.questions.forEach((q) => {
                q.answerOptions.forEach((a) => (a.id = undefined));
                q.id = undefined;
            });
        }
    };

    const validateTest = () => {
        if (!localTest?.title.trim()) {
            setTestTitleError("Заголовок теста не должен быть пустым");
            return false;
        } else {
            setTestTitleError(null);
        }
        const invalidQuestions = localTest?.questions
            .map((q, index) => {
                if (!q.questionText) {
                    return { index, message: "Вопрос не должен быть пустым" };
                }
                if (q.answerOptions.length < 2) {
                    return { index, message: "Вопрос должен иметь минимум 2 ответа" };
                }
                if (!q.answerOptions.some((a) => a.isCorrect)) {
                    return { index, message: "Вопрос должен иметь минимум один правильный ответ" };
                }
                if (q.answerOptions.some((a) => a.optionText === "")) {
                    return { index, message: "Ответ не должен быть пустым" };
                }
                return null;
            })
            .filter((item) => item !== null) as { index: number; message: string }[];

        setInvalidQuestions(invalidQuestions);

        if (invalidQuestions.length > 0) {
            setAlert([{ id: Date.now(), message: 'Пожалуйста, исправьте ошибки в тесте', severity: 'error' }])
            return false;
        }

        return true;
    };

    return (
        <Box display="flex" flexDirection="row" position="relative">
            <Box flexGrow={1} mr="250px">
                <TextField
                    placeholder="Введите название теста"
                    fullWidth
                    multiline
                    value={localTest?.title || ""}
                    variant="outlined"
                    onChange={handleTitleChange}
                    sx={{ "& .MuiInputBase-input": { fontWeight: 500, fontSize: "24px" } }}
                    error={!!testTitleError}
                    helperText={testTitleError}
                />
                {localTest &&
                    localTest.questions.map((question: Question, index) => (
                        <Box
                            key={index}
                            display="flex"
                            alignItems="center"
                            my={2}
                            ref={(el) => (questionRefs.current[index] = el as HTMLDivElement | null)}
                        >
                            <Box flexGrow={1}>
                                <QuestionEdit
                                    question={question}
                                    onQuestionChange={handleQuestionChange}
                                    onDelete={() => handleDeleteQuestion(question.id as number)}
                                    errorMessage={invalidQuestions.find((item) => item.index === index)?.message || ""}
                                />
                            </Box>
                        </Box>
                    ))}
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
                <Paper sx={{ maxWidth: 230, p: 2, position: "fixed" }}>
                    <Button sx={{ mb: 2 }} variant="contained" onClick={handleSave} fullWidth>
                        Сохранить
                    </Button>
                    <Button sx={{ mb: 2 }} variant="outlined" color="primary" onClick={handleAddQuestion} fullWidth>
                        Добавить вопрос
                    </Button>
                    {isEditMode && (
                        <Button sx={{ mb: 2 }} variant="outlined" color="primary" onClick={handleReset} fullWidth>
                            Сбросить
                        </Button>
                    )}
                    <Button variant="outlined" color="secondary" onClick={() => navigate("/tests")} fullWidth>
                        Выйти
                    </Button>
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
