import React from 'react';
import {GridColDef, GridEventListener, GridSortModel} from '@mui/x-data-grid';
import {Box} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {UserTest, useTestStore} from "../../store/tests/testStore";
import {useExportStore} from "../../store/tests/exportStore";
import {GenericTableActions} from "../main/data-display/GenericTableActions";
import {ConfirmationButtonProps} from "../main/ConfirmationButton";
import DateTimeUtils from "../../utils/DateTimeUtils";

const noTestTitle = '-- Создан пользователем --';

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
    searchValue?: string;
    rowCount?: number;
    paginationModel: { page: number, pageSize: number },
    setPaginationModel: (params: { page: number, pageSize: number }) => void;
    sortModel: GridSortModel;
    setSortModel: (params: GridSortModel) => void;
}

export const TestTable: React.FC<Props> = ({
                                               onSelectionModelChange,
                                               loading,
                                               rowCount,
                                               paginationModel,
                                               setPaginationModel,
                                               sortModel,
                                               setSortModel
                                           }) => {
    const {tests, deleteTest} = useTestStore();
    const {exportTest} = useExportStore();
    const navigate = useNavigate();

    const handleEvent: GridEventListener<'cellClick'> = (params) => {
        if (params.field === 'title' || params.field === 'fileName' || params.field === 'createdAt') {
            navigate(`/tests/${params.row.id}`);
        }
    }

    const columns: GridColDef[] = [
        {
            field: 'fileName',
            headerName: 'Файл',
            minWidth: 250,
            flex: 1,
            sortable: false
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
            sortable: false
        },
    ];

    const prepareData = (): UserTest[] => {
        if (tests.length > 0) {
            return tests.map(item => {
                if (!item.fileName) {
                    return {
                        ...item,
                        fileName: noTestTitle
                    };
                }
                return item;
            });
        }
        return tests;
    };

    return (
        <Box>
            <GenericTableActions<UserTest>
                data={prepareData()}
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
                rowCount={rowCount}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                sortModel={sortModel}
                setSortModel={setSortModel}
            />
        </Box>
    );
};
