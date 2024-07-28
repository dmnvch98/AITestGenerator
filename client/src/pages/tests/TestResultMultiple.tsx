import React from "react";
import {usePassTestStore} from "../../store/tests/passTestStore";
import {TestResultTable} from "../../components/tests/TestResultTable";
import {Box, Typography} from "@mui/material";

export const TestResults = () => {
    const testResults = usePassTestStore((state) => state.testResults);
    return (
        <>
            <Box>
                <Typography variant="h4" align='left' sx={{mb: 2}}>Результаты теста</Typography>
                {testResults.map(testResult => <TestResultTable testResult={testResult}/>)}
            </Box>
        </>
    );
};

