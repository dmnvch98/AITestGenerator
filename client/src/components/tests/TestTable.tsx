import React from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Box, IconButton, Menu, MenuItem} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from "react-router-dom";
import {UserTest, useTestStore} from "../../store/tests/testStore";

const Actions = ({test}: { test: UserTest }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const deleteTest = useTestStore(state => state.deleteTest);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        deleteTest(test.id as number);
        handleClose();
    };
    const handleViewClick = () => {
        navigate("/tests/" + test.id);
    }

    const handlePassClick = () => {
        navigate("/tests/" + test.id + "/pass");
    }

    return (
        <div>
            <IconButton onClick={handleClick}>
                <SettingsIcon/>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleViewClick}>View</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                <MenuItem onClick={handlePassClick}>Pass</MenuItem>
            </Menu>
        </div>
    );
};

export const TestTable = () => {
    const userTests = useTestStore(state => state.tests);

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'title',
            headerName: 'Text title',
            width: 0.5 * window.innerWidth,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            renderCell: (params) => {
                const test: UserTest = params.row;

                return (
                    <Box>
                        <IconButton>
                            <Actions test={test}/>
                        </IconButton>
                    </Box>
                );
            },
            sortable: false,
            disableColumnMenu: true,
        },
    ];

    return (
        <Box>
            <DataGrid
                rows={userTests}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 10},
                    },
                }}
                onRowSelectionModelChange={(ids) => {
                    // setSelectedIdsToArray(ids as number[]);
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>


    );
};