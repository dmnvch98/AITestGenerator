import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import React, { useEffect, useState } from "react";
import { Question, UserTest, useTestStore } from "../../store/tests/testStore";
import {useNavigate, useParams} from "react-router-dom";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import QuestionEdit from "../../components/tests/questions/QuestionEdit";

const TestPageEditContent = () => {
    const { id } = useParams();
    const {selectedTest, getUserTestsByIdIn, selectTest, tests, updateTest, clearSelectedTest} = useTestStore();
    const [localTest, setLocalTest] = useState<UserTest | null>(null);
    const navigate = useNavigate();

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
                questionText: 'New Question',
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
            localTest.questions
                .map(q => {
                    q.answerOptions
                        .map(a => a.id = undefined)
                    q.id = undefined;
                })
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

    return (
        <>
            <Box display="flex" sx={{mb: 2, position: "relative"}} justifyContent="flex-start">
                <Button
                    sx={{mr: 2}}
                    variant="outlined"
                    onClick={handleSave}
                >
                    Сохранить
                </Button>
            </Box>
            <TextField
                fullWidth
                multiline
                value={localTest?.title || ''}
                variant="standard"
                onChange={handleTitleChange}
                sx={{ '& .MuiInputBase-input': { fontWeight: 500, fontSize: '24px' } }}
            />
            {localTest && localTest.questions.map((question: Question, index: number) => (
                <Box key={index} display="flex" alignItems="center" my={2}>
                    <Box flexGrow={1}>
                        <QuestionEdit
                            question={question}
                            onQuestionChange={handleQuestionChange}
                            onDelete={() => handleDeleteQuestion(question.id as number)}
                        />
                    </Box>
                </Box>
            ))}
            <Box mt={2}>
                <Button variant="outlined" color="primary" onClick={handleAddQuestion}>
                    Добавить вопрос
                </Button>
            </Box>
        </>
    );
}

export const TestPageEdit = () => {
    return <LoggedInUserPage mainContent={<TestPageEditContent />} />;
}
