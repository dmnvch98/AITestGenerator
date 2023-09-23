import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {useEffect} from "react";
import {useTestStore} from "../../store/tests/testStore";
import {TestTable} from "../../components/tests/TestTable";
import {Alert, Snackbar} from "@mui/material";

const TestsContent = () => {
    const getAllUserTests = useTestStore(state => state.getAllUserTests);
    const testDeletedFlag = useTestStore(state => state.testDeletedFlag);
    const toggleTestDeletedFlag = useTestStore(state => state.toggleTestDeletedFlag);

    useEffect(() => {
        getAllUserTests();
    }, [])
    return (
        <>
            <TestTable/>
            <Snackbar
                open={testDeletedFlag}
                autoHideDuration={3000}
                onClose={toggleTestDeletedFlag}
            >
                <Alert severity="success">
                    Test(s) successfully deleted
                </Alert>
            </Snackbar>
        </>
    )
}

export const Tests = () => {
    return <LoggedInUserPage mainContent={<TestsContent/>}/>;
}