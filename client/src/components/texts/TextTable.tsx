import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {UserText, useTextStore} from "../../store/textStore";
import {Box, Button, IconButton, Menu, MenuItem} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from "react-router-dom";
import {useTestStore} from "../../store/tests/testStore";
import {DoneLabel} from "../utils/DoneLabel";
import {NoLabel} from "../utils/NoLabel";
import Link from "@mui/material/Link";

const Actions = ({text}: { text: UserText }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const deleteText = useTextStore(state => state.deleteText);
    const generateTest = useTestStore(state => state.generateTest);
    const toggleGenerateTestFlag = useTestStore(state => state.toggleGenerateTestFlag);
    const navigate = useNavigate();


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        navigate("/texts/" + text.id + "?edit");
        handleClose();
    }

    const handleGenerateTestClick = () => {
        toggleGenerateTestFlag();
        generateTest(text.id as number)
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
        <Box>
            <IconButton onClick={handleClick}>
                <SettingsIcon/>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleViewClick}>Открыть</MenuItem>
                <MenuItem onClick={handleEditClick}>Редактировать</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Удалить</MenuItem>
                <MenuItem disabled={text.testIds != null} onClick={handleGenerateTestClick}>Сгенерировать тест</MenuItem>
            </Menu>
        </Box>
    );
};

export const TextTable = () => {
    const userTexts = useTextStore((state) => state.texts);
    const deleteInBatch = useTextStore((state) => state.deleteInBatch);
    const setSelectedIdsToArray = useTextStore((state) => state.setSelectedIdsToArray);
    const selectedTextIds = useTextStore((state) => state.selectedTextIds);
    const navigate = useNavigate();

    const columns: GridColDef[] = [
        {
            field: 'title',
            minWidth: 600,
            headerName: 'Заголовок',
            renderCell: (params) => {
                const text: UserText = params.row;
                return (
                    <Link color='inherit'
                          underline='none'
                          href={`/texts/${text.id}`}>
                        {text.title}
                    </Link>
                );
            },
        },
        {
            field: 'test',
            minWidth: 300,
            headerName: 'Тест существут',
            renderCell: (params) => {
                const text: UserText = params.row;
                return text.testIds
                    ? <DoneLabel/>
                    : <NoLabel/>
            },
        },
        {
            field: 'actions',
            headerName: 'Действия',
            renderCell: (params) => {
                const text: UserText = params.row;

                return (
                    <Box>
                        <IconButton>
                            <Actions text={text}/>
                        </IconButton>
                    </Box>
                );
            },
            sortable: false,
            disableColumnMenu: true,
        },
    ];

    return (
        <Box >
            <Box display="flex" sx={{mb: 2}} justifyContent="flex-start">
                <Button
                    sx={{mr: 2}}
                    variant="outlined"
                    onClick={() => navigate('/add-text')}
                >
                    Добавить
                </Button>

                <Button
                    variant="outlined"
                    disabled={selectedTextIds.length === 0}
                    color="error"
                    onClick={deleteInBatch}
                >
                    Удалить выбранное
                </Button>
            </Box>
            <DataGrid
                rows={userTexts}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 10},
                    },
                }}
                onRowSelectionModelChange={(ids) => {
                    setSelectedIdsToArray(ids as number[]);
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
};
