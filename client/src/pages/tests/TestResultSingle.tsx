import React, {useEffect} from "react";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {usePassTestStore} from "../../store/tests/passTestStore";
import {TestResultTable} from "../../components/tests/TestResultTable";
import {Box, Typography} from "@mui/material";
import {useParams} from "react-router-dom";

const TestResultContent = () => {

    const {testId, id} = useParams();
    const {singleTestResult, getSingleTestResult,} = usePassTestStore();
    useEffect(() => {
        if (testId && id) {
            const testIdNumber = Number(testId);
            const resultIdNumber = Number(id);
            getSingleTestResult(testIdNumber, resultIdNumber);
            console.log(singleTestResult)
        }
    }, [])
    return (
        <>
            <Box>
                <Typography variant="h4" align='left' sx={{mb: 2}}>Результаты теста</Typography>
                {singleTestResult && <TestResultTable testResult={singleTestResult}/>}
            </Box>
        </>
    );
};

export const TestResultSingle = () => {
    return <LoggedInUserPage mainContent={<TestResultContent/>}/>;
};
