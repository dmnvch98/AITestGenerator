import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import { GenericTableActions } from "../main/GenericTableActions";
import useFileStore, {FileDto} from "../../store/fileStore";
import DateTimeUtils from "../../utils/DateTimeUtils";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, Typography } from '@mui/material';
import {useTestStore} from "../../store/tests/testStore";
import {AlertMessage} from "../../store/types";

const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
        return <PictureAsPdfIcon sx={{ color: '#FF0000' }} />;
    }
    if (extension === 'doc' || extension === 'docx') {
        return <DescriptionIcon sx={{ color: '#2B579A' }} />;
    }
    return null;
};

const getActions = (
    file: FileDto,
    setAlert: (alert: AlertMessage[]) => void,
    deleteFile: (fileDto: FileDto) => void,
    generateTestByFile: (hashedName: string) => Promise<boolean>
) => [
    {
        label: 'Удалить',
        onClick: () => deleteFile(file),
    },
    {
        label: 'Сгенерировать тест',
        onClick: () => generateTestByFile(file.hashedFilename).then(
            (r) => {
                if (r) {
                    setAlert([{id: Date.now(), message: 'Генерация теста начата', severity: 'success'}]);
                }
            }

        )
    }
];

export const FilesTable = () => {
    const { fileDtos, deleteFile, setAlert, setSelectedFileHashes } = useFileStore();
    const { generateTestByFile } = useTestStore();

    const columns: GridColDef[] = [
        {
            field: 'originalFilename',
            minWidth: 600,
            headerName: 'Заголовок',
            renderCell: (params) => {
                const file: FileDto = params.row;
                return (
                    <Box display="flex" alignItems="center">
                        {getFileIcon(file.originalFilename)}
                        <Typography sx={{ ml: 1 }}>{file.originalFilename}</Typography>
                    </Box>
                );
            }
        },
        {
            field: 'uploadTime',
            minWidth: 300,
            headerName: 'Дата загрузки',
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
            actions={(file) => getActions(file, setAlert, deleteFile, generateTestByFile)}
            rowIdGetter={(row) => row.id as number}
            onSelectionModelChange={setSelectedFileHashes}
        />
    );
};
