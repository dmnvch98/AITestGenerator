import React, {useEffect, useState} from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Chapter, useChapterStore} from "../../zustand/chapterStore";
import {Box, Button, IconButton, Menu, MenuItem} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import {useNavigate} from "react-router-dom";

const Actions = ({chapter}: { chapter: Chapter }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const deleteChapter = useChapterStore(state => state.deleteChapter);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleEditClick = () => {
        navigate("/chapters/" + chapter.id + "?edit=true");
        handleClose();
    }

    const handleDeleteClick = () => {
        deleteChapter(chapter.id as number);
        handleClose();
    };

    const handleViewClick = () => {
        navigate("/chapters/" + chapter.id);
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

export const ChapterTable = () => {
    const userChapters = useChapterStore((state) => state.chapters);
    const deleteInBatch = useChapterStore((state) => state.deleteInBatch);
    const setSelectedIdsToArray = useChapterStore((state) => state.setSelectedIdsToArray);
    const selectedChapterIds = useChapterStore((state) => state.selectedChapterIds);
    const navigate = useNavigate();

    const [columnWidths, setColumnWidths] = useState<{ [field: string]: number }>({
        id: 10, // Процент ширины для поля 'id'
        title: 60, // Процент ширины для поля 'title'
        actions: 30, // Процент ширины для поля 'actions'
    });

    // Обработчик изменения размера окна
    const handleResize = () => {
        // Рассчитываем ширину столбцов в зависимости от текущей ширины экрана
        const windowWidth = window.innerWidth;
        setColumnWidths({
            id: (10 / 100) * windowWidth,
            title: (60 / 100) * windowWidth,
            actions: (30 / 100) * windowWidth,
        });
    };

    useEffect(() => {
        // Устанавливаем начальные значения ширины столбцов при загрузке
        handleResize();

        // Добавляем обработчик события изменения размера окна
        window.addEventListener('resize', handleResize);

        // Убираем обработчик события при размонтировании компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: columnWidths.id },
        {
            field: 'title',
            headerName: 'Chapter title',
            width: columnWidths.title,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: columnWidths.actions,
            renderCell: (params) => {
                const chapter: Chapter = params.row;

                return (
                    <Box>
                        <IconButton>
                            <Actions chapter={chapter} />
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
                rows={userChapters}
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
                    onClick={() => navigate('/add-chapter')}
                >
                    Add Chapter
                </Button>

                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    disabled={selectedChapterIds.length === 0}
                >
                    Generate test
                </Button>

                <Button
                    variant="outlined"
                    disabled={selectedChapterIds.length === 0}
                    color="error"
                    onClick={deleteInBatch}
                >
                    Delete selected
                </Button>
            </Box>
        </Box>
    );
};