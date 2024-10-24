import React, {useState, useEffect} from "react";
import Typography from "@mui/material/Typography";
import {Box, Button, Snackbar, Alert, CircularProgress} from "@mui/material";
import {FileUploadModal} from "../../components/FileUploadModal";
import {FilesTable} from "../../components/files/FilesTable";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {ConfirmationDialog} from "../../components/main/ConfirmationDialog";
import useFileStore from "../../store/fileStore";
import {FileDto} from "../../store/fileStore";
import {GenerateTestRequest, useTestStore} from "../../store/tests/testStore";
import {GenTestModal} from "../../components/tests/GenTestModal";
import {useGenerateTestStore} from "../../store/tests/generateTestStore";
import {useUserStore} from "../../store/userStore";
import Link from "@mui/material/Link";
import {AlertMessage} from "../../store/types";
import {v4 as uuidv4} from "uuid";

const FilesContent = () => {
    const {
        getFiles,
        alerts,
        clearAlerts,
        deleteAlert,
        clearFiles,
        uploadModalOpen,
        setUploadModalOpen,
        isLoading,
        deleteFilesInBatch,
        selectedFileHashes,
        deleteFile
    } = useFileStore();

    const {generateTestByFile} = useTestStore();
    const {maxQuestionsCount, minAnswersCount, temperature, topP} = useGenerateTestStore();
    const {addAlert} = useFileStore();
    const {getTestGenCurrentActivities} = useUserStore();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isGenTestModalOpen, setGenTestModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchFiles = async () => {
        setLoading(true);
        await getFiles();
        setLoading(false);
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleAdd = () => {
        setUploadModalOpen(true);
    };

    const handleModalClose = () => {
        setUploadModalOpen(false);
        clearFiles();
    };

    const openDeleteModal = () => {
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        deleteFilesInBatch();
        setDeleteModalOpen(false);
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

    const generationStartSuccessful = () => {
        addAlert(new AlertMessage('Генерация теста начата', 'success'));
        getTestGenCurrentActivities();
    }

    const handleGenTestSubmit = () => {
        if (selectedFile) {
            const request: GenerateTestRequest = {
                maxQuestionsCount,
                minAnswersCount,
                temperature,
                topP,
                hashedFileName: selectedFile.hashedFilename
            }
            generateTestByFile(request).then((r) => {
                r
                    ? generationStartSuccessful()
                    : new AlertMessage('Ошибка при генерации теста', 'error');
            });
        }
        closeGenTestModal();
    };

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

            <Box display="flex" sx={{mb: 2}} justifyContent="flex-start">
                <Button
                    sx={{mr: 2}}
                    variant="outlined"
                    onClick={handleAdd}
                    disabled={isLoading}
                >
                    Добавить файлы
                </Button>

                <Button
                    sx={{mr: 2}}
                    variant="outlined"
                    color="error"
                    onClick={openDeleteModal}
                    disabled={isDeleteButtonDisabled()}
                >
                    Удалить выбранное
                </Button>
            </Box>

            <FilesTable actions={actions} loading={loading}/>

            <FileUploadModal open={uploadModalOpen} onClose={handleModalClose}/>

            <GenTestModal open={isGenTestModalOpen} onClose={closeGenTestModal} onSubmit={handleGenTestSubmit}/>

            <Snackbar
                open={alerts.length > 0}
                autoHideDuration={10000}
                onClose={clearAlerts}
            >
                <Box sx={{maxWidth: '400px'}}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} severity={alert.severity} sx={{mb: 0.5, textAlign: 'left'}}
                               onClose={() => {
                                   deleteAlert(alert)
                               }}>
                            <span dangerouslySetInnerHTML={{__html: alert.message}}/>
                        </Alert>
                    ))}
                </Box>
            </Snackbar>

            <Snackbar
                open={isLoading}
            >
                <Box sx={{width: '400px'}}>
                    <Alert key={uuidv4()} severity='info' sx={{mb: 0.5, textAlign: 'left'}} icon={<CircularProgress size={24}/>}>
                       Загрузка файлов... Это может занять некоторое время
                    </Alert>
                </Box>
            </Snackbar>

            <ConfirmationDialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Подтверждение удаления"
                children="Вы уверены что хотите удалить выбранные файлы?"
            />

        </>
    );
}

export const Files = () => {
    return <LoggedInUserPage mainContent={<FilesContent/>}/>;
};
