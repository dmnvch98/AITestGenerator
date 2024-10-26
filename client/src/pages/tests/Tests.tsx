import React, {useCallback, useEffect, useState} from "react";
import {BulkDeleteTestsRequestDto, useTestStore} from "../../store/tests/testStore";
import {TestTable} from "../../components/tests/TestTable";
import {Alert, Box, Button, Dialog, Snackbar} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {ConfirmationDialog} from "../../components/main/ConfirmationDialog";
import {ExportModal} from "../../components/export/ExportModal";
import {useExportStore} from "../../store/tests/exportStore";
import {ConfirmationButton} from "../../components/main/ConfirmationButton";

export const Tests = () => {

    const {
        getAllUserTests,
        deleteTest,
        deleteTestFlag,
        setDeleteTestFlag,
        selectedTest,
        alerts,
        clearAlerts,
        deleteAlert,
        bulkDeleteTest,
        clearState
    } = useTestStore();

    const {toggleModelOpen, modalOpen: openExportDialog} = useExportStore();
    const [selectedTestIds, setSelectedTestIds] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    const navigate = useNavigate();

    const handleConfirmDelete = (id: number) => {
        deleteTest(id);
        setDeleteTestFlag(false);
    };

    const fetchTest = async () => {
        setLoading(true);
        await getAllUserTests();
        setLoading(false);
    };

    useEffect(() => {
        fetchTest();
        return () => {
            clearState();
        }
    }, [])

    const handleBulkDelete = useCallback(() => {
        if (selectedTestIds.length > 0) {
            const request: BulkDeleteTestsRequestDto = {
                ids: selectedTestIds
            }
            bulkDeleteTest(request);
        }
    }, [selectedTestIds]);

    const onMultiTestSelection = useCallback((ids: number[]) => {
        setSelectedTestIds(ids);
    }, []);


    return (
        <>
            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-start">
                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    onClick={() => navigate("/tests/create")}
                >
                    Создать тест
                </Button>
                <ConfirmationButton
                    config={
                        {
                            buttonTitle: 'Удалить выбранное',
                            dialogContent: 'Вы уверены что хотите удалить выбранные тесты?',
                            dialogTitle: 'Удаление тестов',
                            variant: 'button',
                            disabled: selectedTestIds.length < 1
                        }
                    }
                    onSubmit={handleBulkDelete}
                />
            </Box>
            <TestTable onSelectionModelChange={onMultiTestSelection} loading={loading}/>
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
                children="Вы уверены что хотите удалить выбранный тест?"
            />
            <Dialog open={openExportDialog} onClose={toggleModelOpen}>
                <ExportModal test={selectedTest} />
            </Dialog>
        </>
    )
}
