import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserTest, useTestStore } from "../../store/tests/testStore";
import { usePassTestStore } from "../../store/tests/passTestStore";
import { useExportStore } from "../../store/tests/exportStore";
import { ExportModal } from "../export/ExportModal";
import { ConfirmationDialog } from "../main/ConfirmationDialog";
import {GenericTableActions} from "../main/GenericTableActions";


const handleView = (navigate: ReturnType<typeof useNavigate>, test: UserTest) => {
    navigate(`/tests/${test.id}`);
};

const handleDelete = ( selectTest: (test: UserTest) => void, setDeleteTestFlag: (flag: boolean) => void, test: UserTest) => {
    selectTest(test);
    setDeleteTestFlag(true);
};

const handlePrint = ( selectTest: (test: UserTest) => void, navigate: ReturnType<typeof useNavigate>, test: UserTest) => {
    selectTest(test);
    navigate(`/tests/${test.id}/print`);
};

const handlePass = (setTestIdsToPass: (ids: number[]) => void, navigate: ReturnType<typeof useNavigate>, test: UserTest) => {
    setTestIdsToPass([test.id]);
    navigate("/tests/pass");
};

const handleExport = (
    selectTest: (test: UserTest) => void,
    toggleOpenExportDialog: () => void,
    test: UserTest
) => {
    selectTest(test);
    toggleOpenExportDialog();
};

const getActions = (
    test: UserTest,
    navigate: ReturnType<typeof useNavigate>,
    setDeleteTestFlag: (flag: boolean) => void,
    setTestIdsToPass: (ids: number[]) => void,
    selectTest: (test: UserTest) => void,
    toggleOpenExportDialog: () => void
) => [
    {
        label: 'Просмотр',
        onClick: () => handleView(navigate, test),
    },
    {
        label: 'Редактировать',
        onClick: () => navigate(`/tests/${test.id}/edit`)
    },
    {
        label: 'Удалить',
        onClick: () => handleDelete(selectTest, setDeleteTestFlag, test),
    },
    {
        label: 'Пройти',
        onClick: () => handlePass(setTestIdsToPass, navigate, test),
    },
    {
        label: 'Экспорт',
        onClick: () => handleExport(selectTest, toggleOpenExportDialog, test),
    },
    {
        label: 'Печать',
        onClick: () => handlePrint(selectTest, navigate, test),
    },
];

export const TestTable = () => {
    const { tests, deleteTest, deleteTestFlag, setDeleteTestFlag, selectTest, selectedTest } = useTestStore();
    const { setTestIdsToPass } = usePassTestStore();
    const { toggleModelOpen, modalOpen: openExportDialog} = useExportStore();
    const navigate = useNavigate();

    const handleConfirmDelete = (id: number) => {
        deleteTest(id);
        setDeleteTestFlag(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'title',
            headerName: 'Заголовок',
            minWidth: 800,
        },
    ];

    return (
        <Box>
            <GenericTableActions<UserTest>
                data={tests}
                columns={columns}
                actions={(test) => getActions(
                    test,
                    navigate,
                    setDeleteTestFlag,
                    setTestIdsToPass,
                    selectTest,
                    toggleModelOpen
                )}
                rowIdGetter={(row) => row.id}
                onSelectionModelChange={setTestIdsToPass}
            />
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
        </Box>
    );
};
