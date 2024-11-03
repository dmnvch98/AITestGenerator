import React, {useCallback} from 'react';
import {
    DataGrid,
    GridColDef, GridEventListener,
    GridRowIdGetter, GridSortModel,
} from '@mui/x-data-grid';
import {Box, IconButton, Menu, MenuItem} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import {tableLables} from './dataGridLabels';
import {ConfirmationButton, ConfirmationButtonProps} from './ConfirmationButton';
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface Action<T> {
    label?: string;
    onClick?: (item: T) => void;
    disabled?: boolean;
    confirmProps?: ConfirmationButtonProps;
}

interface ActionsProps<T> {
    item: T;
    actions: Action<T>[];
}

export const Actions = <T, >({item, actions}: ActionsProps<T>) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
            <IconButton onClick={handleClick}>
                <SettingsIcon/>
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {actions.map((action, index) =>
                    action.confirmProps ? (
                        <ConfirmationButton
                            key={index}
                            config={{
                                buttonTitle: action.confirmProps.buttonTitle,
                                dialogTitle: action.confirmProps.dialogTitle,
                                dialogContent: action.confirmProps.dialogContent,
                                variant: 'menuItem',
                            }}
                            onSubmit={() => {
                                action.onClick && action.onClick(item);
                            }}
                            onClose={handleClose}
                        />
                    ) : (
                        <MenuItem
                            key={index}
                            onClick={() => {
                                action.onClick && action.onClick(item);
                                handleClose();
                            }}
                            disabled={action.disabled}
                        >
                            {action.label}
                        </MenuItem>
                    )
                )}
            </Menu>
        </Box>
    );
};

interface GenericTableProps<T> {
    data: T[];
    columns: GridColDef[];
    actions?: (item: T) => Action<T>[];
    checkboxSelection?: boolean;
    rowIdGetter: (row: T) => number;
    onSelectionModelChange?: (ids: number[]) => void;
    loading?: boolean;
    handleEvent?: GridEventListener<any>;
    sx?: SxProps<Theme>;
    rowCount?: number,
    paginationModel?: { page: number, pageSize: number },
    setPaginationModel?: (params: { page: number, pageSize: number }) => void;
    sortModel?: GridSortModel;
    setSortModel?: (params: GridSortModel) => void;
}

export const GenericTableActions = <T extends Record<string, any>>({
                                                                       data,
                                                                       columns,
                                                                       actions,
                                                                       rowIdGetter,
                                                                       checkboxSelection = true,
                                                                       onSelectionModelChange,
                                                                       loading,
                                                                       handleEvent,
                                                                       sx,
                                                                       rowCount,
                                                                       paginationModel,
                                                                       setPaginationModel,
                                                                       sortModel,
                                                                       setSortModel
                                                                   }: GenericTableProps<T>) => {

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
                onRowSelectionModelChange={(ids) => {
                    onSelectionModelChange && onSelectionModelChange(ids as number[]);
                }}
                localeText={tableLables}
                onCellClick={handleEvent}
                sx={sx}
            />
        </Box>
    );
};

