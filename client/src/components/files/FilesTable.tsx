import React from 'react';
import {GridColDef} from '@mui/x-data-grid';
import {GenericTableActions} from "../main/GenericTableActions";
import useFileStore, {FileDto} from "../../store/fileStore";
import DateTimeUtils from "../../utils/DateTimeUtils";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import {Box, Typography} from '@mui/material';

const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
        return <PictureAsPdfIcon sx={{color: '#FF0000'}}/>;
    }
    if (extension === 'doc' || extension === 'docx') {
        return <DescriptionIcon sx={{color: '#2B579A'}}/>;
    }
    return null;
};

interface FilesTableProps {
    actions: (file: FileDto) => any[];
    loading: boolean;
}

export const FilesTable = ({actions, loading}: FilesTableProps) => {
    const {fileDtos, setSelectedFileHashes} = useFileStore();

    const columns: GridColDef[] = [
        {
            field: 'originalFilename',
            minWidth: 750,
            headerName: 'Заголовок',
            flex: 1,
            renderCell: (params) => {
                const file: FileDto = params.row;
                return (
                    <Box display="flex" alignItems="center">
                        {getFileIcon(file.originalFilename)}
                        <Typography sx={{ml: 1}}>{file.originalFilename}</Typography>
                    </Box>
                );
            }
        },
        {
            field: 'uploadTime',
            minWidth: 150,
            headerName: 'Дата загрузки',
            flex: 1,
            renderCell: (params) => {
                const file: FileDto = params.row;
                return DateTimeUtils.formatDate(file.uploadTime);
            },
        },
    ];

    return (
        <GenericTableActions<FileDto>
            data={fileDtos}
            columns={columns}
            actions={actions}
            rowIdGetter={(row) => row.id as number}
            onSelectionModelChange={setSelectedFileHashes}
            loading={loading}
        />
    );
};
