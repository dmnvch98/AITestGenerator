import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {UserText, useTextStore} from "../../store/textStore";
import {Box, Button, IconButton, Menu, MenuItem} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from "react-router-dom";
import Typography from "@mui/material/Typography";

const Actions = ({text}: { text: UserText }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const deleteText = useTextStore(state => state.deleteText);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        navigate("/texts/" + text.id + "?edit=true");
        handleClose();
    }

    const handleDeleteClick = () => {
        deleteText(text.id as number);
        handleClose();
    };

    const handleViewClick = () => {
        navigate("/texts/" + text.id);
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
                <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
        </div>
    );
};

export const TextTable = () => {
    const userTexts = useTextStore((state) => state.texts);
    const deleteInBatch = useTextStore((state) => state.deleteInBatch);
    const setSelectedIdsToArray = useTextStore((state) => state.setSelectedIdsToArray);
    const selectedTextIds = useTextStore((state) => state.selectedTextIds);
    const navigate = useNavigate();

    const [columnWidths, setColumnWidths] = useState<{ [field: string]: number }>({
        id: 10,
        title: 50,
        actions: 30,
        test:10
    });

    const handleResize = () => {
        const windowWidth = window.innerWidth;
        setColumnWidths({
            id: (10 / 100) * windowWidth,
            title: (50 / 100) * windowWidth,
            actions: (30 / 100) * windowWidth,
            test: (10 / 100) * windowWidth,
        });
    };

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: columnWidths.id },
        {
            field: 'title',
            headerName: 'Text title',
            width: columnWidths.title,
        },
        {
            field: 'test',
            headerName: 'Test Exists',
            width: columnWidths.test,
            renderCell: (params) => {
                const text: UserText = params.row;
                return text.testIds
                    ? <Typography color="darkgreen">Yes</Typography>
                    : <Typography color="error">No</Typography>
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: columnWidths.actions,
            renderCell: (params) => {
                const text: UserText = params.row;

                return (
                    <Box>
                        <IconButton>
                            <Actions text={text} />
                        </IconButton>
                    </Box>
                );
            },
            sortable: false,
            disableColumnMenu: true,
        },
    ];

    return (
        <Box style={{ width: '100%' }}>
            <DataGrid
                rows={userTexts}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
                    },
                }}
                onRowSelectionModelChange={(ids) => {
                    setSelectedIdsToArray(ids as number[]);
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection
                disableRowSelectionOnClick
            />
            <Box display="flex" sx={{ mt: 2 }} justifyContent="flex-start">
                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    onClick={() => navigate('/add-text')}
                >
                    Add Text
                </Button>

                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    disabled={selectedTextIds.length === 0}
                >
                    Generate test
                </Button>

                <Button
                    variant="outlined"
                    disabled={selectedTextIds.length === 0}
                    color="error"
                    onClick={deleteInBatch}
                >
                    Delete selected
                </Button>
            </Box>
        </Box>
    );
};