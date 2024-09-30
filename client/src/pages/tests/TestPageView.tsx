import { LoggedInUserPage } from "../../components/main/LoggedInUserPage";
import React, { useEffect, useState } from "react";
import { useTestStore } from "../../store/tests/testStore";
import { QuestionView } from "../../components/tests/questions/QuestionView";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { Box, Button, Paper } from "@mui/material";

const TestPageViewContent = () => {
    const { id } = useParams();
    const selectedTest = useTestStore(state => state.selectedTest);
    const getUserTestById = useTestStore(state => state.getUserTestById);
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        getUserTestById(Number(id));
    }, [id, getUserTestById]);

    const handleEdit = () => {
        navigate(`/tests/${id}/edit`)
    }

    const handleToggleExpand = () => {
        setIsExpanded(prev => !prev);
    }

    return (
        <Box display="flex" flexDirection="row" position="relative">
            <Box flexGrow={1} mr={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Paper sx={{ p: 2, width: '100%' }}>
                        <Typography
                            align="left"
                            sx={{
                                fontWeight: 500,
                                fontSize: "24px",
                            }}
                        >
                            {selectedTest?.title}
                        </Typography>
                    </Paper>
                </Box>

                {selectedTest && selectedTest.questions.map((question, index) =>
                    (
                        <QuestionView key={index} question={question} isExpanded={isExpanded} />
                    ))
                }
            </Box>

            <Box>
                <Paper sx={{ p: 2, minWidth: 230 }}>
                    <Button variant="contained" color="primary" onClick={handleEdit} fullWidth sx={{ mb: 2 }}>
                        Редактировать
                    </Button>

                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleToggleExpand}
                        fullWidth
                    >
                        {isExpanded ? 'Свернуть все' : 'Раскрыть все'}
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}

export const TestPageView = () => {
    return <LoggedInUserPage mainContent={<TestPageViewContent />} />;
}
