import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {useEffect} from "react";
import {useTestStore} from "../../store/tests/testStore";
import {TestTable} from "../../components/tests/TestTable";
import {Alert, Snackbar} from "@mui/material";
import Typography from "@mui/material/Typography";

const TestsContent = () => {
    const getAllUserTests = useTestStore(state => state.getAllUserTests);
    const testDeletedFlag = useTestStore(state => state.testDeletedFlag);
    const toggleTestDeletedFlag = useTestStore(state => state.toggleTestDeletedFlag);

    useEffect(() => {
        getAllUserTests();
    }, [])
    return (
        <>
            <Typography variant="h5" align="left" sx={{mb: 2}}>
                Сгенерированные тесты
            </Typography>
            <TestTable/>
            <Snackbar
                open={testDeletedFlag}
                autoHideDuration={3000}
                onClose={toggleTestDeletedFlag}
            >
                <Alert severity="success">
                    Тест успешно удален
                </Alert>
            </Snackbar>
        </>
    )
}

export const Tests = () => {
    return <LoggedInUserPage mainContent={<TestsContent/>}/>;
}
