import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import React, { useEffect, useState } from "react";
import { useTestStore } from "../../store/tests/testStore";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import {Box, Button, Divider, Paper} from "@mui/material";
import {TestViewModeSelector} from "./edit/components/TestViewModeSelector";
import {QuestionPagination} from "./edit/components/QuestionPagination";
import {QuestionListView, QuestionPaginatedView} from "./edit/components/TestDisplayMode";

const TestPageViewContent = () => {
    const { id } = useParams();
    const selectedTest = useTestStore(state => state.selectedTest);
    const getUserTestById = useTestStore(state => state.getUserTestById);
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState<'list' | 'paginated'>('paginated');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
        getUserTestById(Number(id));
    }, [id, getUserTestById]);

    const handleEdit = () => {
        navigate(`/tests/${id}/edit`);
    }

    const handleExit = () => {
        navigate('/tests');
    }

    return (
        <Box display="flex" flexDirection="row" position="relative" sx={{mb: 2}}>
            <Box flexGrow={1} mr="250px">
                <Paper sx={{minHeight: '100px', pb: 0.25}}>
                    <Box sx={{ml: 4, mr: 4, pt: 2}}>
                        <Typography
                            align="left"
                            sx={{
                                fontWeight: 600,
                                fontSize: "24px",
                            }}
                        >
                            {selectedTest?.title}
                        </Typography>
                    </Box>
                    <Divider sx={{mt: 2, mb: 2}}/>
                    {viewMode === 'list' ? (
                        <QuestionListView
                            questions={selectedTest?.questions || []}
                            editMode={false}
                            invalidQuestions={[]} onDelete={() => {}}
                            onQuestionChange={() => {}}/>
                    ) : (
                        <QuestionPaginatedView
                            questions={selectedTest?.questions || []}
                            currentQuestionIndex={currentQuestionIndex}
                            onSelectQuestion={setCurrentQuestionIndex}
                            editMode={false} // Просмотр, а не редактирование
                            invalidQuestions={[]}
                            onDelete={() => {}}
                            onQuestionChange={() => {}}/>
                    )}
                </Paper>
            </Box>

            <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
                <Paper sx={{width: '230px', p: 2, position: "fixed"}}>
                    <TestViewModeSelector viewMode={viewMode} onChange={setViewMode}/>
                    <Divider sx={{mb: 3}}/>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleEdit}
                        sx={{mb: 2}}
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
                        />
                    )}
                </Paper>
            </Box>
        </Box>
    );
}

export const TestPageView = () => {
    return <LoggedInUserPage mainContent={<TestPageViewContent />} />;
}
