import React, {useCallback, useEffect, useState} from "react";
import {CreateTestRequestDto, Question, UserTest, useTestStore} from "../../../store/tests/testStore";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, CircularProgress, Paper} from "@mui/material";
import {QuestionPaginatedView} from "../edit/components/TestDisplayMode";
import {validateTest, createNewQuestion} from "../edit/utils";
import {TestTitleInput} from "../edit/components/TestTitleInput";
import {TestFormActions} from "../edit/components/TestFormActions";
import {QuestionPagination} from "../edit/components/QuestionPagination";
import {ContentActionsPage} from "../../../components/main/data-display/ContentActionsPage";
import NotificationService from "../../../services/notification/NotificationService";
import {AlertMessage} from "../../../store/types";

interface TestFormProps {
    initialTest: UserTest | CreateTestRequestDto;
    isLoading?: boolean;
}

const MAX_QUESTIONS_COUNT = 40;
const MAX_ANSWERS_COUNT = 10;

export const TestForm: React.FC<TestFormProps> = ({initialTest, isLoading}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {upsert, clearState} = useTestStore();
    const [localTest, setLocalTest] =
        useState<UserTest | CreateTestRequestDto>(initialTest);
    const [testTitleError] = useState<string | null>(null);
    const [invalidQuestions, setInvalidQuestions] = useState<{ index: number; message: string, id: number }[]>([]);
    const [hasSaved, setHasSaved] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [lastSavedTest, setLastSavedTest] = useState<UserTest | null>(null);
    const [testHistory, setTestHistory] = useState<(UserTest | CreateTestRequestDto)[]>([]); // История изменений

    const isTestModified = useCallback(() => {
        return JSON.stringify(localTest) !== JSON.stringify(lastSavedTest ?? initialTest);
    }, [localTest, lastSavedTest, initialTest]);


    useEffect(() => {
        if (!isTestModified()) {
            setInvalidQuestions([]);
        }
    }, [isTestModified]);

    useEffect(() => {
        if (initialTest && !hasSaved) setLocalTest({...initialTest});
    }, [initialTest, hasSaved]);

    useEffect(() => {
        return () => {
            clearState();
        }
    }, []);

    useEffect(() => {
        if (currentQuestionIndex !== 0 && currentQuestionIndex  >= localTest.questions.length) {
            setCurrentQuestionIndex(localTest.questions.length - 1);
        }
    }, [localTest.questions.length]);

    const handleSave = () => {
        const {valid, invalidQuestions} = validateTest(localTest, setCurrentQuestionIndex);
        if (valid) {
            upsert(localTest).then(resp => {
                if (resp != null) {
                    setHasSaved(true);
                    setLocalTest(resp);
                    setLastSavedTest(resp);
                    setInvalidQuestions([]);
                    setTestHistory([]);
                }
            });
        } else {
            setInvalidQuestions(invalidQuestions);
        }
    };

    const handleAddQuestion = () => {
        if (localTest.questions.length >= MAX_QUESTIONS_COUNT) {
            NotificationService.addAlert(new AlertMessage(`Максимальное число вопросов: ${MAX_QUESTIONS_COUNT}`, 'error'));
            return;
        }
        saveToHistory(localTest);
        setLocalTest({
            ...localTest,
            questions: [...localTest.questions, createNewQuestion()],
        });
        setCurrentQuestionIndex(localTest.questions.length);
    };

    const handleDeleteQuestion = (id: number) => {
        saveToHistory(localTest);
        const updatedQuestions = localTest.questions.filter((q: Question) => q.id !== id);
        setCurrentQuestionIndex(updatedQuestions.length - 1);
        setLocalTest({...localTest, questions: updatedQuestions});
        if (invalidQuestions.map(q => q.id).includes(id)) {
            const newInvalidQuestions = invalidQuestions.filter(q => q.id !== id);
            setInvalidQuestions(newInvalidQuestions);
        }
    }

    const handleQuestionChange = (updatedQuestion: Question) => {
        if (updatedQuestion.answerOptions.length > MAX_ANSWERS_COUNT) {
            NotificationService.addAlert(new AlertMessage(`Максимальное число ответов: ${MAX_ANSWERS_COUNT}`, 'error'));
            return;
        }
        saveToHistory(localTest);
        setLocalTest(prevTest => ({
            ...prevTest,
            questions: prevTest.questions.map((q) =>
                q.id === updatedQuestion.id ? { ...updatedQuestion } : q
            ),
        }));
    };
    const handleReturnToPrevPage = () => {
        const prevUrl = location?.state?.previousLocationPathname || '/tests';
        navigate(prevUrl);
    }

    const handleExit = () => {
        navigate("/tests");
    }

    const saveToHistory = (newState: UserTest | CreateTestRequestDto) => {
        setTestHistory(prev => {
            const updatedHistory = [...prev, newState];
            return updatedHistory.length > 10 ? updatedHistory.slice(1) : updatedHistory;
        });
    };

    const handleUndo = () => {
        setTestHistory(prev => {
            if (prev.length === 0) return prev;
            const lastState = prev[prev.length - 1];
            setLocalTest(lastState);
            return prev.slice(0, -1);
        });
    };

    const Content = (
        <Box>
            <Box sx={{p: 2}}>
                <TestTitleInput title={localTest.title || ""}
                                isLoading={isLoading as boolean}
                                onChange={(e) => setLocalTest({...localTest, title: e.target.value})}
                                error={testTitleError}/>
            </Box>

            <Paper>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress/>
                    </Box>
                ) : (
                    <QuestionPaginatedView
                        questions={localTest.questions}
                        currentQuestionIndex={currentQuestionIndex}
                        invalidQuestions={invalidQuestions}
                        onDelete={handleDeleteQuestion}
                        onQuestionChange={handleQuestionChange}
                        onSelectQuestion={setCurrentQuestionIndex}
                        editMode={true}
                    />
                )}
            </Paper>

        </Box>
    )

    const Actions = (
        <Box sx={{mt: -2}}>
            <TestFormActions
                isLoading={isLoading as boolean}
                onSave={handleSave}
                onAddQuestion={handleAddQuestion}
                onUndo={handleUndo}
                onExit={handleExit}
                onReturn={handleReturnToPrevPage}
                isTestModified={isTestModified()}
                undoActionsAvailable={testHistory.length > 0}
            />
            <QuestionPagination
                loading={isLoading}
                currentIndex={currentQuestionIndex}
                totalQuestions={localTest.questions.length}
                onChange={setCurrentQuestionIndex}
                invalidQuestionNumbers={invalidQuestions.map(q => q.index + 1)}
            />
        </Box>
    )

    return (
        <ContentActionsPage content={Content} actions={Actions}/>
    );
};
