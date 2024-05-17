import React from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Box, Button, IconButton, Menu, MenuItem, Dialog} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from "react-router-dom";
import {UserTest, useTestStore} from "../../store/tests/testStore";
import {usePassTestStore} from "../../store/tests/passTestStore";
import {useExportStore} from "../../store/tests/exportStore";
import {ExportModal} from "../export/ExportModal";
import {ConfirmationDialog} from "../main/ConfirmationDialog";

const Actions = ({test}: { test: UserTest }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openExportDialog = useExportStore(state => state.modalOpen);
    const toggleOpenExportDialog = useExportStore(state => state.toggleModelOpen);
    const {
        setSelectedTestId,
        setSelectedTestTitle
    } = useExportStore();

    const {deleteTest, deleteTestFlag, setDeleteTestFlag} = useTestStore();

    const setTestIdsToPass = usePassTestStore(state => state.setTestIdsToPass);
    const navigate = useNavigate();


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        setDeleteTestFlag(true);
        handleClose();
    };
    const handleViewClick = () => {
        navigate("/tests/" + test.id);
    }

    const handlePassClick = () => {
        setTestIdsToPass([test.id])
        navigate("/tests/pass");
    }

    const handleExportClick = () => {
        setSelectedTestId(test.id);
        setSelectedTestTitle(test.title);
        toggleOpenExportDialog();
    }

    const handleConfirmDelete = () => {
        deleteTest(test.id as number);
        setDeleteTestFlag(false);
    };

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
                <MenuItem onClick={handleViewClick}>Просмотр</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Удалить</MenuItem>
                <MenuItem onClick={handlePassClick}>Пройти</MenuItem>
                <MenuItem onClick={handleExportClick}>Экспорт</MenuItem>
            </Menu>

            <Dialog open={openExportDialog} onClose={toggleOpenExportDialog}>
                <ExportModal/>
            </Dialog>
            <ConfirmationDialog
                open={deleteTestFlag}
                onClose={() => setDeleteTestFlag(false)}
                onConfirm={handleConfirmDelete}
                title="Подтверждение удаления теста"
                content="Вы уверены что хотите удалить выбранный тест? Все связанные с ним сущности будут удалениы"
            />
        </div>
    );
};

export const TestTable = () => {
    const setTestIdsToPass = usePassTestStore(state => state.setTestIdsToPass);
    const {tests} = useTestStore();
    const navigate = useNavigate();

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: 'title',
            headerName: 'Заголовок',
            minWidth: 800
        },
        {
            field: 'actions',
            headerName: 'Действия',
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
            <Box display="flex" sx={{mb: 2}} justifyContent="flex-start">
                <Button
                    sx={{mr: 2}}
                    variant="outlined"
                    onClick={() => navigate("/tests/pass")}
                >
                    Пройти выбранное
                </Button>

            </Box>
            <DataGrid
                rows={tests}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 10},
                    },
                }}
                onRowSelectionModelChange={(ids) => {
                    setTestIdsToPass(ids as number[]);
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection
                disableRowSelectionOnClick
            />

        </Box>


    );
};
