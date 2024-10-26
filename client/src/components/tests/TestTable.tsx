import React from 'react';
import {GridColDef, GridEventListener} from '@mui/x-data-grid';
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserTest, useTestStore } from "../../store/tests/testStore";
import { useExportStore } from "../../store/tests/exportStore";
import {GenericTableActions} from "../main/GenericTableActions";
import {ConfirmationButtonProps} from "../main/ConfirmationButton";
import DateTimeUtils from "../../utils/DateTimeUtils";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

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

    const handleEvent: GridEventListener<'cellClick'> = (params) => {
        if (params.field === 'title' || params.field === 'fileName' || params.field === 'createdAt') {
            navigate(`/tests/${params.row.id}`);
        }
    }

    const style: SxProps<Theme> = {
        '& .MuiDataGrid-cell:hover': {
            cursor: 'pointer'
        },
    }

    const columns: GridColDef[] = [
        {
            field: 'fileName',
            headerName: 'Файл',
            minWidth: 250,
            flex: 1
        },
        {
            field: 'createdAt',
            headerName: 'Время создания',
            minWidth: 150,
            flex: 1,
            renderCell: (params) => (
                <Box>
                    {DateTimeUtils.formatDateTime(params.value)}
                </Box>
            )
        },
        {
            flex: 1,
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
                    exportTest
                )}
                rowIdGetter={(row) => row.id}
                onSelectionModelChange={onSelectionModelChange}
                loading={loading}
                handleEvent={handleEvent}
                sx={style}
            />
        </Box>
    );
};
