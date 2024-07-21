import {TestGenHistoryTable} from "../../components/history/TestGenHistoryTable";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import Box from "@mui/material/Box";
import {useUserStore} from "../../store/userStore";
import {Button} from "@mui/material";

const TestGenHistoryContent = () => {

    const getTestGenHistory = useUserStore(state => state.getTestGenHistory);

    useEffect(() => {
        getTestGenHistory();
    }, [])

    return(
        <>
            <Typography variant="h5" align="left" sx={{ mb: 2 }}>
                История генерации тестов
            </Typography>
            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-end">
                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    onClick={getTestGenHistory}
                    size="small"
                >
                    <ReplayOutlinedIcon/>
                </Button>
            </Box>
            <TestGenHistoryTable/>
        </>
    )
}

export const TestGenHistory = () => {
    return <LoggedInUserPage mainContent={<TestGenHistoryContent/>}/>
}