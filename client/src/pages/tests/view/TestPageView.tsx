import React, { useEffect, useState } from "react";
import {BulkDeleteTestsRequestDto, useTestStore} from "../../../store/tests/testStore";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Box, Divider, Skeleton, CircularProgress, Snackbar, Alert, Paper} from "@mui/material";
import { TestViewModeSelector } from "../edit/components/TestViewModeSelector";
import { QuestionPagination } from "../edit/components/QuestionPagination";
import { QuestionListView, QuestionPaginatedView } from "../edit/components/TestDisplayMode";
import { TestRatingForm } from "./components/TestRatingForm";
import { AlertMessage } from "../../../store/types";
import { TestViewActions } from "./components/TestViewActions";
import { useExportStore } from "../../../store/tests/exportStore";
import {ContentActionsPage} from "../../../components/main/data-display/ContentActionsPage";

export const TestPageView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [viewMode, setViewMode] = useState<'list' | 'paginated'>('paginated');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [testLoading, setTestLoading] = useState<boolean>(true);
    const [ratingLoading, setRatingLoading] = useState<boolean>(true);

    const {
        selectedTest,
        getUserTestById,
        alerts,
        addAlert,
        clearAlerts,
        deleteAlert,
        getRating,
        clearState,
        bulkDeleteTest
    } = useTestStore();

    const { exportTest } = useExportStore();

    const fetchTest = async () => {
        setTestLoading(true);
        await getUserTestById(Number(id)).then(test => {
            if (!test) {
                navigate('/tests');
                addAlert(new AlertMessage('Тест не найден', 'error'));
            }
        });
        setTestLoading(false);
    }

    const fetchRating = async () => {
        setRatingLoading(true);
        await getRating(Number(id));
        setRatingLoading(false);
    }

    useEffect(() => {
        fetchTest();
        fetchRating();
    }, [id]);

    useEffect(() => {
        if (selectedTest) {
            return () => {
                clearState();
            }
        }
    }, []);

    const handleEdit = () => {
        navigate(`/tests/${id}/edit`, { state: { previousLocationPathname: location.pathname } });
    }

    const handleExit = () => {
        navigate('/tests');
    }

    const handlePrint = () => {
        navigate(`/tests/${id}/print`, { state: { previousLocationPathname: location.pathname } });
    }

    const handleExport = () => {
        selectedTest && exportTest(selectedTest);
    }

    const handleDelete = () => {
        if (selectedTest) {
            const request: BulkDeleteTestsRequestDto = {
                ids: [selectedTest.id]
            }
            bulkDeleteTest(request);
        }
    }

    const Content = (
        <Paper>
            <Box sx={{ ml: 4, mr: 4, pt: 2 }}>
                {testLoading ? (
                    <Typography component="div" key={'h3'} variant={'h3'}>
                        <Skeleton />
                    </Typography>
                ) : (
                    <Typography align="left" sx={{ fontWeight: 600, fontSize: "24px" }}>
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
                        invalidQuestions={[]}
                        onDelete={() => {}}
                        onQuestionChange={() => {}}
                    />
                ) : (
                    <QuestionPaginatedView
                        questions={selectedTest?.questions || []}
                        currentQuestionIndex={currentQuestionIndex}
                        onSelectQuestion={setCurrentQuestionIndex}
                        editMode={false}
                        invalidQuestions={[]}
                        onDelete={() => {}}
                        onQuestionChange={() => {}}
                    />
                )
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
    );

    const Actions = (
        <Box>
            <TestViewModeSelector viewMode={viewMode} onChange={setViewMode} disabled={testLoading} />
            <TestViewActions
                onEdit={handleEdit}
                isLoading={testLoading}
                onExit={handleExit}
                onPrint={handlePrint}
                onExport={handleExport}
                onDelete={handleDelete}
            />
            {viewMode === 'paginated' && (
                <Box sx={{mb: 3}}>
                    <QuestionPagination
                        currentIndex={currentQuestionIndex}
                        totalQuestions={selectedTest?.questions?.length as number}
                        onChange={setCurrentQuestionIndex}
                        invalidQuestionNumbers={[]}
                        loading={testLoading}
                    />
                </Box>
            )}
            {selectedTest && selectedTest.fileName && (
                <Box sx={{ mt: 2 }}>
                    <TestRatingForm id={selectedTest.id} loading={ratingLoading} />
                </Box>
            )}
        </Box>
    );

    return (
        <ContentActionsPage content={Content} actions={Actions} />
    );
}