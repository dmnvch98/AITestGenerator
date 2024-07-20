import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import React, {useEffect} from "react";
import {useTestStore} from "../../store/tests/testStore";
import {TestTable} from "../../components/tests/TestTable";
import {Alert, Box, Button, Dialog, Snackbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {ConfirmationDialog} from "../../components/main/ConfirmationDialog";
import {ExportModal} from "../../components/export/ExportModal";
import {useExportStore} from "../../store/tests/exportStore";

const TestsContent = () => {
    const {
        getAllUserTests,
        deleteTest,
        deleteTestFlag,
        setDeleteTestFlag,
        selectedTest,
        alerts,
        clearAlerts,
        deleteAlert
    } = useTestStore();

    const {toggleModelOpen, modalOpen: openExportDialog} = useExportStore();

    const navigate = useNavigate();

    const handleConfirmDelete = (id: number) => {
        deleteTest(id);
        setDeleteTestFlag(false);
    };

    useEffect(() => {
        getAllUserTests();
    }, [])
    return (
        <>
            <Typography variant="h5" align="left" sx={{mb: 2}}>
                Сгенерированные тесты
            </Typography>
            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-start">
                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    onClick={() => navigate("/tests/pass")}
                >
                    Пройти выбранное
                </Button>
            </Box>
            <TestTable/>
            <Snackbar
                open={alerts.length > 0}
                autoHideDuration={6000}
                onClose={clearAlerts}
            >
                <Box sx={{maxWidth: '400px'}}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} severity={alert.severity} sx={{mb: 0.5, textAlign: 'left'}}
                               onClose={() => deleteAlert(alert)}>
                            <span dangerouslySetInnerHTML={{__html: alert.message}}/>
                        </Alert>
                    ))}
                </Box>
            </Snackbar>
            <ConfirmationDialog
                open={deleteTestFlag}
                onClose={() => setDeleteTestFlag(false)}
                onConfirm={() => handleConfirmDelete(selectedTest?.id as number)}
                title="Подтверждение удаления теста"
                content="Вы уверены что хотите удалить выбранный тест? Все связанные с ним сущности будут удалены"
            />
            <Dialog open={openExportDialog} onClose={toggleModelOpen}>
                <ExportModal test={selectedTest} />
            </Dialog>
        </>
    )
}

export const Tests = () => {
    return <LoggedInUserPage mainContent={<TestsContent/>}/>;
}
