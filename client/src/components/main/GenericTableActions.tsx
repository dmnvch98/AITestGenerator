import React from 'react';
import {DataGrid, GridColDef, GridRowIdGetter} from '@mui/x-data-grid';
import {Box, IconButton, Menu, MenuItem} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

interface Action<T> {
    label: string;
    onClick: (item: T) => void;
    disabled?: boolean;
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

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {actions.map((action, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            action.onClick(item);
                            handleClose();
                        }}
                        disabled={action.disabled}
                    >
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};

interface GenericTableProps<T> {
    data: T[];
    columns: GridColDef[];
    actions: (item: T) => Action<T>[];
    rowIdGetter: (row: T) => number;
    onSelectionModelChange?: (ids: number[]) => void;
}

export const GenericTableActions = <T, >({
                                      data,
                                      columns,
                                      actions,
                                      rowIdGetter,
                                      onSelectionModelChange
                                  }: GenericTableProps<T>) => {
    const actionColumn: GridColDef = {
        field: 'actions',
        headerName: 'Действия',
        renderCell: (params) => {
            const item: T = params.row;
            return (
                <Actions
                    item={item}
                    actions={actions(item)}
                />
            );
        },
        sortable: false,
        disableColumnMenu: true,
    };

    return (
        <Box>
            <DataGrid
                rows={data}
                columns={[...columns, actionColumn]}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={rowIdGetter as GridRowIdGetter<any>}
                onRowSelectionModelChange={(ids) => {
                    onSelectionModelChange && onSelectionModelChange(ids as number[]);
                }}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
            />
        </Box>
    );
};
