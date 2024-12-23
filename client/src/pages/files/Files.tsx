import React, {useState, useEffect} from "react";
import Typography from "@mui/material/Typography";
import {Box, Snackbar, Alert, CircularProgress} from "@mui/material";
import {FileUploadModal} from "./components/FileUploadModal";
import {FilesTable} from "./components/FilesTable";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import useFileStore from "./store/fileStore";
import {FileDto} from "./store/fileStore";
import {GenerateTestRequest, useTestStore} from "../../store/tests/testStore";
import {GenTestModal} from "../../components/tests/GenTestModal";
import {useUserStore} from "../../store/userStore";
import Link from "@mui/material/Link";
import {AlertMessage, QueryOptions} from "../../store/types";
import {v4 as uuidv4} from "uuid";
import {FilesActionToolbar} from "./components/FilesActionToolbar";
import {GridSortModel} from "@mui/x-data-grid";

const FilesContent = () => {
    const {
        getFiles,
        clearFiles,
        uploadModalOpen,
        setUploadModalOpen,
        isLoading,
        deleteFilesInBatch,
        selectedFileHashes,
        deleteFile,
        totalUserFiles
    } = useFileStore();

    const {generateTestByFile, isGenerateTestByFileQueueing} = useTestStore();
    const {getTestGenCurrentActivities} = useUserStore();

    const [isGenTestModalOpen, setGenTestModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileDto | null>(null);
    const [searchValue, setSearchValue] = useState<string>('');
    const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>(searchValue);
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'uploadTime', sort: 'desc' }]);

    const fetchFiles = async (options?: QueryOptions) => {
        await getFiles(options);
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

    const handleAdd = () => {
        setUploadModalOpen(true);
    };

    const handleModalClose = () => {
        setUploadModalOpen(false);
        clearFiles();
    };

    const isDeleteButtonDisabled = () => {
        return selectedFileHashes.length === 0;
    };

    const openGenTestModal = (file: FileDto) => {
        setSelectedFile(file);
        setGenTestModalOpen(true);
    };

    const closeGenTestModal = () => {
        setGenTestModalOpen(false);
    };

    const handleGenTestSubmit = (maxQuestionsCount: number, answersCount: number, correctAnswersCount: number) => {
        closeGenTestModal();
        if (selectedFile) {
            const request: GenerateTestRequest = {
                maxQuestionsCount,
                answersCount,
                correctAnswersCount,
                hashedFileName: selectedFile.hashedFilename,
                originalFileName: selectedFile.originalFilename
            };
            generateTestByFile(request);
            getTestGenCurrentActivities();
            closeGenTestModal();
        }
    };


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchValue('');
    }

    const actions = (file: FileDto) => [
        {
            onClick: () => deleteFile(file),
            confirmProps: {
                buttonTitle: 'Удалить',
                dialogTitle: 'Подтверждение удаления',
                dialogContent: `Вы уверены что хотите удалить <b>${file.originalFilename}</b> ?`,
                variant: 'menuItem'
            }
        },
        {
            label: 'Сгенерировать тест',
            onClick: () => openGenTestModal(file)
        }
    ];

    return (
        <>
            <Typography variant="h5" align="left" sx={{mb: 1}}>
                Файлы
            </Typography>
            <Alert severity="info" icon={false} sx={{ mb: 2 }}>
                <Box textAlign="left">
                    Загрузите файл для генерации теста. После загрузки выберите: Действия → Сгенерировать тест.
                    <br/>
                    Статус активных генераций можно посмотреть <Link href="/tests?activeTab=history" underline="hover"
                                                                     color="inherit"><b>здесь</b></Link>.
                </Box>
            </Alert>

            <FilesActionToolbar
                onAdd={handleAdd}
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

            <FileUploadModal open={uploadModalOpen} onClose={handleModalClose}/>

            <GenTestModal open={isGenTestModalOpen} onClose={closeGenTestModal} onSubmit={handleGenTestSubmit}/>
        </>
    );
}

export const Files = () => {
    return <LoggedInUserPage mainContent={<FilesContent/>}/>;
};
