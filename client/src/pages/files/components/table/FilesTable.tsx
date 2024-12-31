import React from 'react';
import {GridColDef, GridEventListener, GridSortModel} from '@mui/x-data-grid';
import {GenericTableActions} from "../../../../components/main/data-display/GenericTableActions";
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
    const {userFiles, selectedFileIds,  setSelectedFileIds, addSelectedFileId} = useFileStore();

    const handleEvent: GridEventListener<'cellClick'> = (params) => {
        if (params.field === 'originalFilename' || params.field === 'uploadTime') {
            addSelectedFileId(params.row.id);
        }
    }

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
            onSelectionModelChange={setSelectedFileIds}
            loading={loading}
            rowCount={rowCount}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            sortModel={sortModel}
            setSortModel={setSortModel}
            handleEvent={handleEvent}
            selectionModel={selectedFileIds}
        />
    );
};
