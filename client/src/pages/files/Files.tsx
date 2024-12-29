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
        selectedFileHashes,
        deleteUserFile,
        totalUserFiles
    } = useFileStore();

    const [searchValue, setSearchValue] = useState<string>('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>(searchValue);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'uploadTime', sort: 'desc' }]);

    const fetchFiles = async (options?: QueryOptions) => {
        await getUserFiles(options);
    };

    useEffect(() => {
        const searchOptions: QueryOptions = {
            page: paginationModel.page,
            size: paginationModel.pageSize,
            sortBy: sortModel[0]?.field,
            sortDirection: sortModel[0]?.sort ?? 'asc',
            search: debouncedSearchValue
        };
        fetchFiles(searchOptions);
    }, [debouncedSearchValue, paginationModel, sortModel]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchValue]);

    const isDeleteButtonDisabled = () => {
        return selectedFileHashes.length === 0;
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchValue('');
    }

    const actions = (file: FileDto) => [
        {
            onClick: () => deleteUserFile(file),
            confirmProps: {
                buttonTitle: 'Удалить',
                dialogTitle: 'Подтверждение удаления',
                dialogContent: `Вы уверены что хотите удалить <b>${file.originalFilename}</b> ?`,
                variant: 'menuItem'
            }
        },
        {
            label: 'Предпросмотр',
            onClick: () => {}
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
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                onSearchClear={handleClearSearch}
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
