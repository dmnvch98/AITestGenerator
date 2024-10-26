import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserTest, useTestStore } from "../../store/tests/testStore";
import { usePassTestStore } from "../../store/tests/passTestStore";
import { useExportStore } from "../../store/tests/exportStore";
import {GenericTableActions} from "../main/GenericTableActions";
import {ConfirmationButtonProps} from "../main/ConfirmationButton";

const handleView = (navigate: ReturnType<typeof useNavigate>, test: UserTest) => {
    navigate(`/tests/${test.id}`);
};

const handleExport = (
    exportTest: (test: UserTest) => void,
    test: UserTest
) => {
    exportTest(test);
};

const getActions = (
    test: UserTest,
    navigate: ReturnType<typeof useNavigate>,
    deleteTest: (id: number) => void,
    exportTest: (test: UserTest) => void
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
        label: 'Экспорт (Gift)',
        onClick: () => handleExport(exportTest, test),
    },
    {
        label: 'Печать',
        onClick: () => navigate(`/tests/${test.id}/print`),
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
];

interface Props {
    onSelectionModelChange: (testIds: number[]) => void;
    loading: boolean;
}

export const TestTable: React.FC<Props> = ({ onSelectionModelChange, loading }) => {
    const { tests, deleteTest } = useTestStore();
    const { exportTest } = useExportStore();
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
            renderCell: (params) => (
                <Box
                    onClick={() => navigate(`/tests/${params.row.id}`)}
                    sx={{
                        cursor: 'pointer',
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {params.value}
                </Box>
            )
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
                    exportTest
                )}
                rowIdGetter={(row) => row.id}
                onSelectionModelChange={onSelectionModelChange}
                loading={loading}
            />
        </Box>
    );
};
