import React from 'react';
import {GridColDef, GridSortModel} from '@mui/x-data-grid';
import {GenericTableActions} from "../../../../components/main/GenericTableActions";
import DateTimeUtils from "../../../../utils/DateTimeUtils";
import {Box, Typography} from '@mui/material';
import {getFileIcon} from "../helper";
import useFileStore from "../../store/fileStore";
import {FileDto} from "../../types";

interface FilesTableProps {
    actions: (file: FileDto) => any[];
    loading: boolean;
    rowCount?: number;
    paginationModel: { page: number, pageSize: number },
    setPaginationModel: (params: { page: number, pageSize: number }) => void;
    sortModel: GridSortModel;
    setSortModel: (params: GridSortModel) => void;
}

export const FilesTable = ({actions, loading, rowCount, paginationModel, sortModel, setSortModel, setPaginationModel}: FilesTableProps) => {
    const {userFiles, setSelectedFileHashes} = useFileStore();

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
            data={userFiles}
            columns={columns}
            actions={actions}
            rowIdGetter={(row) => row.id as number}
            onSelectionModelChange={setSelectedFileHashes}
            loading={loading}
            rowCount={rowCount}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            sortModel={sortModel}
            setSortModel={setSortModel}
        />
    );
};
