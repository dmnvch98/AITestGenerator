import React, {useCallback} from 'react';
import {
    DataGrid,
    GridColDef, GridEventListener, GridRowId,
    GridRowIdGetter, GridSortModel,
} from '@mui/x-data-grid';
import {Box} from '@mui/material';
import {tableLables} from '../dataGridLabels';
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";
import {Action, Actions} from "./Actions";

interface GenericTableProps<T> {
    data: T[];
    columns: GridColDef[];
    actions?: (item: T) => Action<T>[];
    checkboxSelection?: boolean;
    rowIdGetter: (row: T) => number | string;
    onSelectionModelChange?: (ids: number[]) => void;
    loading?: boolean;
    handleEvent?: GridEventListener<any>;
    rowCount?: number,
    paginationModel?: { page: number, pageSize: number },
    setPaginationModel?: (params: { page: number, pageSize: number }) => void;
    sortModel?: GridSortModel;
    setSortModel?: (params: GridSortModel) => void;
    selectionModel?: GridRowId[];
}

export const GenericTableActions = <T extends Record<string, any>>({
                                                                       data,
                                                                       columns,
                                                                       actions,
                                                                       rowIdGetter,
                                                                       checkboxSelection = true,
                                                                       selectionModel,
                                                                       onSelectionModelChange,
                                                                       loading,
                                                                       handleEvent,
                                                                       rowCount,
                                                                       paginationModel,
                                                                       setPaginationModel,
                                                                       sortModel,
                                                                       setSortModel,
                                                                   }: GenericTableProps<T>) => {

    const style: SxProps<Theme> = {
        '& .MuiDataGrid-cell:hover': {
            cursor: 'pointer'
        },
        '& .MuiDataGrid-cell:focus': {
            outline: 'none'
        },
        '& .MuiDataGrid-row:focus-within': {
            outline: 'none'
        },
    }

    const handlePaginationModelChange = useCallback((newPaginationModel: { page: number, pageSize: number }) => {
        setPaginationModel && setPaginationModel(newPaginationModel);
    }, []);

    const handleSortModelChange = useCallback((newSortModel: GridSortModel) => {
        setSortModel && setSortModel(newSortModel);
        paginationModel && handlePaginationModelChange({...paginationModel, page: 0});
    }, []);

    const columnsWithActions = actions
        ? [
            ...columns,
            {
                field: 'actions',
                headerName: 'Действия',
                renderCell: (params) => {
                    const item: T = params.row;
                    const actionItems = actions(item);
                    return actionItems && actionItems.length > 0 ? <Actions item={item} actions={actionItems} /> : null;
                },
                sortable: false,
                disableColumnMenu: true,
            } as GridColDef,
        ]
        : columns;

    return (
        <Box>
            <DataGrid
                key={data?.length}
                loading={loading}
                autoHeight
                rows={data}
                rowCount={rowCount}
                columns={columnsWithActions}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection={checkboxSelection}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                disableRowSelectionOnClick
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={handleSortModelChange}
                getRowId={rowIdGetter as GridRowIdGetter<any>}
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={(ids) => {
                    onSelectionModelChange && onSelectionModelChange(ids as number[]);
                }}
                localeText={tableLables}
                onCellClick={handleEvent}
                sx={style}
            />
        </Box>
    );
};

