import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import React, { useEffect, useState } from "react";
import { Question, UserTest, useTestStore } from "../../store/tests/testStore";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import QuestionEdit from "../../components/tests/questions/QuestionEdit";
import { Paper } from "@mui/material";

const TestPageEditContent = () => {
    const { id } = useParams();
    const { selectedTest, getUserTestsByIdIn, selectTest, tests, updateTest, clearSelectedTest } = useTestStore();
    const [localTest, setLocalTest] = useState<UserTest | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [previousPath, setPreviousPath] = useState<string | null>(null);

    useEffect(() => {
        if (location.state?.from) {
            setPreviousPath(location.state.from);
        }
        console.log(location)
    }, []);

    useEffect(() => {
        if (tests.length === 0) {
            getUserTestsByIdIn([Number(id)]).then(() => {
                loadTestData(Number(id));
            });
        } else {
            loadTestData(Number(id));
        }
    }, [id, tests]);

    useEffect(() => {
        if (selectedTest) {
            setLocalTest({ ...selectedTest });
        }
    }, [selectedTest]);

    const loadTestData = (id: number) => {
        const test = tests.find(test => test.id === id);
        if (test) {
            selectTest(test);
        }
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
                questionText: '',
                answerOptions: []
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

    const removeLocalIds = () => {
        if (localTest) {
            localTest.questions.forEach(q => {
                q.answerOptions.forEach(a => a.id = undefined);
                q.id = undefined;
            });
        }
    }

    const handleSave = () => {
        if (localTest) {
            removeLocalIds();
            updateTest(localTest);
            clearSelectedTest();
        }
        navigate("/tests");
    };

    const handleReset = () => {
        if (selectedTest) {
            setLocalTest(cloneDeep(selectedTest));
        }
    };

    const handleExit = () => {
        if (previousPath) {
            navigate(previousPath);
        } else {
            navigate("/tests");
        }
    };

    const cloneDeep = (obj: any) => {
        return JSON.parse(JSON.stringify(obj));
    };

    return (
        <Box display="flex" flexDirection="row" position="relative">
            <Box flexGrow={1} mr="250px">
                <TextField
                    fullWidth
                    multiline
                    value={localTest?.title || ''}
                    variant="outlined"
                    onChange={handleTitleChange}
                    sx={{ '& .MuiInputBase-input': { fontWeight: 500, fontSize: '24px' } }}
                />
                {localTest && localTest.questions.map((question: Question) => (
                    <Box key={question.id} display="flex" alignItems="center" my={2}>
                        <Box flexGrow={1}>
                            <QuestionEdit
                                question={question}
                                onQuestionChange={handleQuestionChange}
                                onDelete={() => handleDeleteQuestion(question.id as number)}
                            />
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
                <Paper sx={{ maxWidth: 230, p: 2, position: 'fixed' }}>
                    <Button
                        sx={{ mb: 2 }}
                        variant="contained"
                        onClick={handleSave}
                        fullWidth
                    >
                        Сохранить
                    </Button>
                    <Button
                        sx={{ mb: 2 }}
                        variant="outlined"
                        color="primary"
                        onClick={handleAddQuestion}
                        fullWidth
                    >
                        Добавить вопрос
                    </Button>
                    <Button
                        sx={{ mb: 2 }}
                        variant="outlined"
                        color="primary"
                        onClick={handleReset}
                        fullWidth
                    >
                        Сбросить
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleExit}
                        fullWidth
                    >
                        Выйти
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}

export const TestPageEdit = () => {
    return <LoggedInUserPage mainContent={<TestPageEditContent />} />;
}
