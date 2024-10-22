import { LoggedInUserPage } from "../../../components/main/LoggedInUserPage";
import React, { useEffect, useState } from "react";
import { useTestStore } from "../../../store/tests/testStore";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Alert, Box, Button, Divider, Paper, Snackbar, Skeleton, CircularProgress} from "@mui/material";
import { TestViewModeSelector } from "../edit/components/TestViewModeSelector";
import { QuestionPagination } from "../edit/components/QuestionPagination";
import { QuestionListView, QuestionPaginatedView } from "../edit/components/TestDisplayMode";
import { TestRatingForm } from "./components/TestRatingForm";
import {AlertMessage} from "../../../store/types";

const TestPageViewContent = () => {
    const { id } = useParams();
    const {
        selectedTest,
        getUserTestById,
        alerts,
        addAlert,
        clearAlerts,
        deleteAlert,
        getRating,
        clearState
    } = useTestStore();
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'paginated'>('paginated');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [testLoading, setTestLoading] = useState<boolean>(true);
    const [ratingLoading, setRatingLoading] = useState<boolean>(true);

    const fetchTest = async () => {
        setTestLoading(true);
        await getUserTestById(Number(id)).then(test => {
            if (!test) {
                navigate('/tests');
                addAlert(new AlertMessage('Тест не найден', 'error'))
            }
        });
        setTimeout(() => {
            setTestLoading(false);
        }, 200);
    }

    const fetchRaiting = async () => {
        setRatingLoading(true);
        await getRating(Number(id));
        setTimeout(() => {
            setRatingLoading(false);
        }, 200);
    }

    useEffect(() => {
        fetchTest();
        fetchRaiting();
    }, [id, getUserTestById]);

    useEffect(() => {
        return () => {
            clearState();
        }
    }, []);

    const handleEdit = () => {
        navigate(`/tests/${id}/edit`);
    }

    const handleExit = () => {
        navigate('/tests');
    }

    return (
        <Box display="flex" flexDirection="row" position="relative" sx={{ mb: 2 }}>
            <Box flexGrow={1} mr="250px">
                <Paper sx={{ minHeight: '100px', pb: 0.25 }}>
                    <Box sx={{ ml: 4, mr: 4, pt: 2 }}>
                        {testLoading ? (
                            <Typography component="div" key={'h3'} variant={'h3'}>
                                <Skeleton />
                            </Typography>
                        ) : (
                            <Typography
                                align="left"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "24px",
                                }}
                            >
                                {selectedTest?.title}
                            </Typography>
                        )}
                    </Box>
                    <Divider sx={{ mt: 2, mb: 2 }} />

                    {testLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    ) : (
                        viewMode === 'list' ? (
                            <QuestionListView
                                questions={selectedTest?.questions || []}
                                editMode={false}
                                invalidQuestions={[]} onDelete={() => {}}
                                onQuestionChange={() => { }} />
                        ) : (
                            <QuestionPaginatedView
                                questions={selectedTest?.questions || []}
                                currentQuestionIndex={currentQuestionIndex}
                                onSelectQuestion={setCurrentQuestionIndex}
                                editMode={false} // Просмотр, а не редактирование
                                invalidQuestions={[]}
                                onDelete={() => {}}
                                onQuestionChange={() => { }} />
                        )
                    )}
                </Paper>
            </Box>

            <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
                <Box sx={{ width: '230px', position: "fixed" }}>
                    <Paper sx={{ p: 2 }}>
                        <TestViewModeSelector viewMode={viewMode} onChange={setViewMode} disabled={testLoading} />
                        <Divider sx={{ mb: 3 }} />
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleEdit}
                            disabled={testLoading}
                            sx={{ mb: 2 }}
                        >
                            Редактировать
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            onClick={handleExit}
                        >
                            Выйти
                        </Button>
                        {viewMode === 'paginated' && (
                            <QuestionPagination
                                currentIndex={currentQuestionIndex}
                                totalQuestions={selectedTest?.questions?.length as number}
                                onChange={setCurrentQuestionIndex}
                                invalidQuestionNumbers={[]}
                                loading={testLoading}
                            />
                        )}
                    </Paper>
                    <Box sx={{ mt: 2 }}>
                        {selectedTest && selectedTest.fileName && <TestRatingForm id={selectedTest.id} loading={ratingLoading} />}
                    </Box>
                </Box>
            </Box>

            <Snackbar open={alerts.length > 0} autoHideDuration={6000} onClose={clearAlerts}>
                <Box sx={{ maxWidth: '400px' }}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} severity={alert.severity} onClose={() => deleteAlert(alert)}>
                            <span dangerouslySetInnerHTML={{ __html: alert.message }} />
                        </Alert>
                    ))}
                </Box>
            </Snackbar>
        </Box>
    );
}

export const TestPageView = () => {
    return <LoggedInUserPage mainContent={<TestPageViewContent />} />;
}
