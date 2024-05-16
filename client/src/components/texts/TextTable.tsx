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
import {ConfirmationDialog} from "../main/ConfirmationDialog";

const Actions = ({text}: { text: UserText }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const {deleteText, deleteTextFlag, setDeleteTextFlag} = useTextStore();

    const {generateTest, toggleGenerateTestFlag} = useTestStore();

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
        setDeleteTextFlag(true);
        handleClose();
    };

    const handleConfirmDelete = () => {
        deleteText(text.id as number);
        setDeleteTextFlag(false);
        setConfirmOpen(false);
    };

    const handleViewClick = () => {
        navigate("/texts/" + text.id);
    }

    const textToDelete: string = "Вы уверены что хотите удалить текст? Все связанные с ним сущности будут удалениы"

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
            <ConfirmationDialog
                open={deleteTextFlag}
                onClose={() => setDeleteTextFlag(false)}
                onConfirm={handleConfirmDelete}
                title="Подтверждение удаления"
                content={textToDelete}
            />
        </Box>
    );
};

export const TextTable = () => {
    const {texts, deleteInBatch,
        setSelectedIdsToArray, selectedTextIds
    } = useTextStore();
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
                rows={texts}
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
