import React, {useEffect, useState} from "react";
import {CreateTestRequestDto, Question, UserTest, useTestStore} from "../../../store/tests/testStore";
import {useLocation, useNavigate} from "react-router-dom";
import {Box, Snackbar, Alert, CircularProgress, Paper} from "@mui/material";
import {QuestionPaginatedView} from "../edit/components/TestDisplayMode";
import {validateTest, createNewTest, createNewQuestion} from "../edit/utils";
import {TestTitleInput} from "../edit/components/TestTitleInput";
import {TestFormActions} from "../edit/components/TestFormActions";
import {QuestionPagination} from "../edit/components/QuestionPagination";
import {ContentActionsPage} from "../../../components/main/data-display/ContentActionsPage";

interface TestFormProps {
    initialTest: UserTest | CreateTestRequestDto;
    isEditMode: boolean;
    isLoading?: boolean;
}

export const TestForm: React.FC<TestFormProps> = ({initialTest, isEditMode, isLoading}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const {alerts, clearAlerts, deleteAlert, addAlert, upsert} = useTestStore();
    const [localTest, setLocalTest] =
        useState<UserTest | CreateTestRequestDto>(initialTest);
    const [testTitleError] = useState<string | null>(null);
    const [invalidQuestions, setInvalidQuestions] = useState<{ index: number; message: string, id?: string }[]>([]);
    const [hasSaved, setHasSaved] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [lastSavedTest, setLastSavedTest] = useState<UserTest | null>(null);

    useEffect(() => {
        if (isEditMode && initialTest && !hasSaved) setLocalTest({...initialTest});
    }, [initialTest, hasSaved, isEditMode]);

    const handleSave = () => {
        const {valid, invalidQuestions} = validateTest(localTest, addAlert, setCurrentQuestionIndex);
        if (valid) {
            upsert(localTest).then(resp => {
                if (resp != null) {
                    setHasSaved(true);
                    setLocalTest(resp);
                    setLastSavedTest(resp);
                    setInvalidQuestions([]);
                }
            });
        } else {
            setInvalidQuestions(invalidQuestions);
        }
    };

    const isTestModified = () => {
        return JSON.stringify(localTest) !== JSON.stringify(lastSavedTest ?? initialTest);
    }

    const handleAddQuestion = () => {
        setLocalTest({
            ...localTest,
            questions: [...localTest.questions, createNewQuestion()],
        });
        setCurrentQuestionIndex(localTest.questions.length);
    };

    const handleDeleteQuestion = (id: string) => {
        const updatedQuestions = localTest.questions.filter((q: Question) => q.id !== id);
        setCurrentQuestionIndex(updatedQuestions.length - 1);
        setLocalTest({...localTest, questions: updatedQuestions});
        if (invalidQuestions.map(q => q.id).includes(id)) {
            const newInvalidQuestions = invalidQuestions.filter(q => q.id !== id);
            setInvalidQuestions(newInvalidQuestions);
        }
    }

    const handleQuestionChange = (updatedQuestion: Question) => {
        setLocalTest(prevTest => ({
            ...prevTest,
            questions: prevTest.questions.map((q) =>
                q.id === updatedQuestion.id ? { ...updatedQuestion } : q
            ),
        }));
    };

    const handleReset = () => {
        const resetTest = lastSavedTest ?? initialTest ?? createNewTest();
        setLocalTest(resetTest);
        setCurrentQuestionIndex(0);
        setInvalidQuestions([]);
    };

    const handleReturnToPrevPage = () => {
        const prevUrl = location?.state?.previousLocationPathname || '/tests';
        navigate(prevUrl);
    }

    const handleExit = () => {
        navigate("/tests");
    }

    const Content = (
        <Paper>
            <Box sx={{ml: 4, mr: 4, pt: 2}}>
                <TestTitleInput title={localTest.title || ""}
                                isLoading={isLoading as boolean}
                                onChange={(e) => setLocalTest({...localTest, title: e.target.value})}
                                error={testTitleError}/>
            </Box>

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
            <Snackbar open={alerts.length > 0} autoHideDuration={6000} onClose={clearAlerts}>
                <Box sx={{maxWidth: '400px'}}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} severity={alert.severity} onClose={() => deleteAlert(alert)}>
                            <span dangerouslySetInnerHTML={{__html: alert.message}}/>
                        </Alert>
                    ))}
                </Box>
            </Snackbar>
        </Paper>
    )

    const Actions = (
        <Box sx={{mt: -2}}>
            <TestFormActions
                isLoading={isLoading as boolean}
                onSave={handleSave}
                onAddQuestion={handleAddQuestion}
                onReset={handleReset}
                onExit={handleExit}
                onReturn={handleReturnToPrevPage}
                isTestModified={isTestModified()}
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
