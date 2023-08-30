import React, {useEffect} from 'react';
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {Chapter, useChapterStore} from "../../zustand/chapterStore";
import {Box, IconButton, Menu, MenuItem} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';

type ChaptersProps = {
    chapters: Chapter[]
}

const Actions = ({ chapter }: { chapter: Chapter }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const setChapterForPreview = useChapterStore(state => state.setChapterForPreview);
    const deleteChapter = useChapterStore(state => state.deleteChapter);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handlePreviewClick = () => {
        setChapterForPreview(chapter);
        handleClose();
    };

    const handleDeleteClick = () => {
        deleteChapter(chapter.id as number);
        handleClose();
    };

    return (
        <div>
            <IconButton onClick={handleClick}>
                <SettingsIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handlePreviewClick}>Preview</MenuItem>
                <MenuItem onClick={handleClose}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
            </Menu>
        </div>
    );
};

export const ChapterTable = () => {
    const userChapters = useChapterStore(state => state.chapters);
    const getUserChapters = useChapterStore(state => state.getChapters);
    useEffect(() => {
        getUserChapters();
    }, [])

    const columns: GridColDef[] = [
        {field: 'id', headerName: 'ID', minWidth: 50},
        {
            field: 'title',
            headerName: 'Chapter title',
            width: 470
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 70,
            align: "center",
            renderCell: (params) => {
                const chapter: Chapter = params.row;

                return (
                    <div>
                        <IconButton>
                            <Actions chapter={chapter} />
                        </IconButton>
                    </div>
                );
            },
            sortable: false,
            disableColumnMenu: true,
        }
    ];

    return (
        <Box style={{width: '100%'}}>
            <DataGrid
                rows={userChapters}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {page: 0, pageSize: 10},
                    },
                }}
                pageSizeOptions={[5, 10, 15]}
                checkboxSelection
                disableRowSelectionOnClick
            />
        </Box>
    );
}
