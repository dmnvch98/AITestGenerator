import React, {useState, useEffect} from "react";
import Typography from "@mui/material/Typography";
import {FilesTable} from "./components/table/FilesTable";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import useFileStore from "./store/fileStore";
import { QueryOptions} from "../../store/types";
import {FilesActionToolbar} from "./components/FilesActionToolbar";
import {GridSortModel} from "@mui/x-data-grid";
import {FileDto} from "./types";

const FilesContent = () => {
    const {
        getUserFiles,
        isLoading,
        deleteFilesInBatch,
        selectedFileIds,
        deleteUserFile,
        totalUserFiles,
        downloadFile
    } = useFileStore();

    const [searchValue, setSearchValue] = useState<string>('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'id', sort: 'desc' }]);

    const fetchFiles = async (options?: QueryOptions) => {
        if (!isLoading) {
            await getUserFiles(options);
        }
    };

    useEffect(() => {
        const searchOptions: QueryOptions = {
            page: paginationModel.page,
            size: paginationModel.pageSize,
            sortBy: sortModel[0]?.field || 'id',
            sortDirection: sortModel[0]?.sort || 'desc',
            search: searchValue
        };
        fetchFiles(searchOptions);
    }, [searchValue, paginationModel, sortModel]);

    const isDeleteButtonDisabled = () => {
        return selectedFileIds.length === 0;
    };

    const handleSearchChange = (value: string) => {
        setSearchValue(value);
    };

    const actions = (file: FileDto) => [
        {
            label: 'Скачать',
            onClick: () => downloadFile(file.hashedFilename)
        },
        {
            onClick: () => deleteUserFile(file),
            confirmProps: {
                buttonTitle: 'Удалить',
                dialogTitle: 'Подтверждение удаления',
                dialogContent: `Вы уверены что хотите удалить <b>${file.originalFilename}</b> ?`,
                variant: 'menuItem'
            }
        }
    ];

    return (
        <>
            <Typography variant="h5" align="left" sx={{mb: 1}}>
                Файлы
            </Typography>

            <FilesActionToolbar
                onDelete={deleteFilesInBatch}
                deleteDisabled={isDeleteButtonDisabled()}
                onSearchChange={handleSearchChange}
            />

            <FilesTable
                actions={actions}
                loading={isLoading}
                rowCount={totalUserFiles}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                sortModel={sortModel}
                setSortModel={setSortModel}
            />

        </>
    );
}

export const Files = () => {
    return <LoggedInUserPage mainContent={<FilesContent/>}/>;
};
