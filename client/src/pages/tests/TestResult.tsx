import React, {useEffect} from "react";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {usePassTestStore} from "../../store/tests/passTestStore";
import {TestResultTable} from "../../components/tests/TestResultTable";
import {Box, Typography} from "@mui/material";

const TestResultContent = () => {
    const testResults = usePassTestStore((state) => state.testResults);
    useEffect(() => {console.log(testResults)}, [])
    return (
        <>
            <Box>
                <Typography variant="h4" align='left' sx={{mb: 2}}>Результаты теста</Typography>
                {testResults.map(testResult => <TestResultTable testResult={testResult}/>)}
            </Box>
        </>
    );
};

export const TestResults = () => {
    return <LoggedInUserPage mainContent={<TestResultContent/>}/>;
};
