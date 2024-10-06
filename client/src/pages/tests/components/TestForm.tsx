import React, {useEffect, useState} from "react";
import {CreateTestRequestDto, Question, UserTest, useTestStore} from "../../../store/tests/testStore";
import {useNavigate} from "react-router-dom";
import {Box, Paper, Snackbar, Alert, Divider} from "@mui/material";
import {QuestionListView, QuestionPaginatedView} from "../edit/components/TestDisplayMode";
import {validateTest, createNewTest, createNewQuestion} from "../edit/utils";
import {TestTitleInput} from "../edit/components/TestTitleInput";
import {TestViewModeSelector} from "../edit/components/TestViewModeSelector";
import {TestFormActionButtons} from "../edit/components/ActionButtonProps";
import {QuestionPagination} from "../edit/components/QuestionPagination";

interface TestFormProps {
    initialTest?: UserTest;
    isEditMode: boolean;
}

export const TestForm: React.FC<TestFormProps> = ({initialTest, isEditMode}) => {
    const navigate = useNavigate();
    const {alerts, clearAlerts, deleteAlert, setAlert, upsert} = useTestStore();
    const [localTest, setLocalTest] = useState<UserTest | CreateTestRequestDto>(() => isEditMode && initialTest ? {...initialTest} : createNewTest());
    const [testTitleError] = useState<string | null>(null);
    const [invalidQuestions, setInvalidQuestions] = useState<{ index: number; message: string, id?: string }[]>([]);
    const [hasSaved, setHasSaved] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [viewMode, setViewMode] = useState<'list' | 'paginated'>('paginated');
    const [lastSavedTest, setLastSavedTest] = useState<UserTest | null>(null);

    useEffect(() => {
        if (isEditMode && initialTest && !hasSaved) setLocalTest({...initialTest});
    }, [initialTest, hasSaved, isEditMode]);

    const handleSave = () => {
        const {valid, invalidQuestions} = validateTest(localTest, setAlert, setCurrentQuestionIndex);
        if (valid) {
            invalidQuestions.length > 0 && setInvalidQuestions([]);
            upsert(localTest).then(resp => {
                if (resp != null) {
                    setHasSaved(true);
                    setLocalTest(resp);
                    setLastSavedTest(resp);
                }
            });
        } else {
            setInvalidQuestions(invalidQuestions);
        }
    };

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
        const updatedQuestions = localTest.questions.map((q: Question) =>
            q.id === updatedQuestion.id ? updatedQuestion : q
        );
        setLocalTest({...localTest, questions: updatedQuestions});
    };

    const handleReset = () => {
        const resetTest = lastSavedTest ?? initialTest ?? createNewTest();
        setLocalTest(resetTest);
        setCurrentQuestionIndex(0);
        setInvalidQuestions([]);
    };

    return (
        <Box display="flex" flexDirection="row" position="relative">
            <Box flexGrow={1} mr="250px">
                <Paper sx={{minHeight: '100px'}}>
                    <Box sx={{ml: 4, mr: 4, pt: 2}}>
                        <TestTitleInput title={localTest.title || ""}
                                        onChange={(e) => setLocalTest({...localTest, title: e.target.value})}
                                        error={testTitleError}/>
                    </Box>

                    {viewMode === 'list' ? (
                        <QuestionListView
                            questions={localTest.questions}
                            invalidQuestions={invalidQuestions}
                            onDelete={handleDeleteQuestion}
                            onQuestionChange={handleQuestionChange}
                            editMode={true}
                        />
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

            <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
                <Paper sx={{maxWidth: 230, p: 2, position: "fixed"}}>
                    <TestViewModeSelector viewMode={viewMode} onChange={setViewMode}/>
                    <Divider sx={{mb: 3}}/>
                    <TestFormActionButtons
                        onSave={handleSave}
                        onAddQuestion={handleAddQuestion}
                        onReset={handleReset}
                        onExit={() => navigate("/tests")}
                    />
                    {viewMode === 'paginated' && (
                        <QuestionPagination
                            currentIndex={currentQuestionIndex}
                            totalQuestions={localTest.questions.length}
                            onChange={setCurrentQuestionIndex}
                            invalidQuestionNumbers={invalidQuestions.map(q => q.index + 1)}
                        />
                    )}
                </Paper>
            </Box>

            <Snackbar open={alerts.length > 0} autoHideDuration={6000} onClose={clearAlerts}>
                <Box sx={{maxWidth: '400px'}}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} severity={alert.severity} onClose={() => deleteAlert(alert)}>
                            <span dangerouslySetInnerHTML={{__html: alert.message}}/>
                        </Alert>
                    ))}
                </Box>
            </Snackbar>
        </Box>
    );
};
