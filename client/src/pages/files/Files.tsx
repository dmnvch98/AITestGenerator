import useFileStore from "../../store/fileStore";
import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import {Alert, Box, Button, CircularProgress, Snackbar} from "@mui/material";
import {FileUploadModal} from "../../components/FileUploadModal";
import {FilesTable} from "../../components/files/FilesTable";
import {LoggedInUserPage} from "../../components/main/LoggedInUserPage";

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
        setIsLoading
    } = useFileStore();

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
        </>
    );
}

export const Files = () => {
    return <LoggedInUserPage mainContent={<FilesContent/>}/>
}