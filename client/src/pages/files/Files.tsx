import useFileStore from "../../store/fileStore";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {Alert, Box, Button, Snackbar} from "@mui/material";
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
        setUploadModalOpen
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
        </>
    );
}

export const Files = () => {
    return <LoggedInUserPage mainContent={<FilesContent/>}/>
}