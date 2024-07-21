import useFileStore from "../../store/fileStore";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {Alert, Box, Button, CircularProgress, Snackbar} from "@mui/material";
import {FileUploadModal} from "../../components/FileUploadModal";
import {FilesTable} from "../../components/files/FilesTable";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";
import {ConfirmationDialog} from "../../components/main/ConfirmationDialog";

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
        setIsLoading,
        deleteFilesInBatch,
        selectedFileHashes
    } = useFileStore();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        getFiles();
    }, []);

    const handleAdd = () => {
        setUploadModalOpen(true);
    }

    const handleModalClose = () => {
        setUploadModalOpen(false);
        clearFiles();
    }

    const openDeleteModal = () => {
        setDeleteModalOpen(true);
    }

    const handleDelete = async () => {
        deleteFilesInBatch();
        setDeleteModalOpen(false);
    }

    const isDeleteButtonDisabled = () => {
        return selectedFileHashes.length == 0;
    }

    return(
        <>
            <Typography variant="h5" align="left" sx={{mb: 2}}>
                Файлы
            </Typography>

            <Box display="flex" sx={{ mb: 2 }} justifyContent="flex-start">
                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    onClick={handleAdd}
                    disabled={isLoading}
                >
                    Добавить файлы
                </Button>

                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    color="error"
                    onClick={openDeleteModal}
                    disabled={isDeleteButtonDisabled()}
                >
                    Удалить выбранное
                </Button>
            </Box>

            <FilesTable/>

            <FileUploadModal open={uploadModalOpen} onClose={handleModalClose}/>

            <Snackbar
                open={alerts.length > 0}
                autoHideDuration={6000}
                onClose={clearAlerts}
            >
                <Box sx={{maxWidth: '400px'}}>
                    {alerts.map(alert => (
                        <Alert key={alert.id} severity={alert.severity} sx={{mb: 0.5, textAlign: 'left'}}
                               onClose={() => deleteAlert(alert)}>
                            <span dangerouslySetInnerHTML={{__html: alert.message}}/>
                        </Alert>
                    ))}
                </Box>
            </Snackbar>

            <Snackbar
                open={isLoading}
                onClose={() => setIsLoading(false)}
            >

                <Alert key={Math.random()} severity="info" sx={{ mb: 0.5 }} icon={<CircularProgress size={18} />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span>Загрузка файлов</span>

                    </Box>
                </Alert>
            </Snackbar>

            <ConfirmationDialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Подтверждение пакетного удаления"
                content="Вы уверены что хотите удалить выбранные файлы? Все связанные с ними сущности будут удалениы"
            />
        </>
    );
}

export const Files = () => {
    return <LoggedInUserPage mainContent={<FilesContent/>}/>
}