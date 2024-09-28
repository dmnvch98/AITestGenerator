import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box, Dialog } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserTest, useTestStore } from "../../store/tests/testStore";
import { usePassTestStore } from "../../store/tests/passTestStore";
import { useExportStore } from "../../store/tests/exportStore";
import { ExportModal } from "../export/ExportModal";
import {GenericTableActions} from "../main/GenericTableActions";
import {ConfirmationButtonProps} from "../main/ConfirmationButton";


const handleView = (navigate: ReturnType<typeof useNavigate>, test: UserTest) => {
    navigate(`/tests/${test.id}`);
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
    deleteTest: (id: number) => void,
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
        onClick: () => deleteTest(test.id),
        confirmProps: {
            buttonTitle: 'Удалить',
            dialogTitle: 'Подтверждение удаления',
            dialogContent: `Вы уверены что хотите удалить тест <b>${test.title}</b> ?`,
            variant: 'menuItem'
        } as ConfirmationButtonProps
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
        onClick: () => navigate(`/tests/${test.id}/print`),
    },
];

interface Props {
    onSelectionModelChange: (testIds: number[]) => void;
}

export const TestTable: React.FC<Props> = ({ onSelectionModelChange }) => {
    const { tests, deleteTest, selectTest, selectedTest } = useTestStore();
    const { setTestIdsToPass } = usePassTestStore();
    const { toggleModelOpen, modalOpen: openExportDialog} = useExportStore();
    const navigate = useNavigate();

    const columns: GridColDef[] = [
        {
            field: 'order',
            headerName: '#',
        },
        {
            field: 'fileName',
            headerName: 'Файл',
            minWidth: 250,
        },
        {
            field: 'title',
            headerName: 'Заголовок',
            minWidth: 550,
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
                    deleteTest,
                    setTestIdsToPass,
                    selectTest,
                    toggleModelOpen
                )}
                rowIdGetter={(row) => row.id}
                onSelectionModelChange={onSelectionModelChange}
            />

            <Dialog open={openExportDialog} onClose={toggleModelOpen}>
                <ExportModal test={selectedTest} />
            </Dialog>
        </Box>
    );
};
