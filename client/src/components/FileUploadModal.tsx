import React, { useState, ChangeEvent, DragEvent } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import useFileStore from "../store/fileStore";
import {AlertMessage} from "../store/types";

interface FileUploadModalProps {
    open: boolean;
    onClose: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ open, onClose }) => {
    const {filesToUpload, addFiles, removeFile, uploadFiles, setAlert, getFiles, setUploadModalOpen, setIsLoading} = useFileStore();
    const [dragOver, setDragOver] = useState(false);

    const MAX_FILES = 6;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement> | DragEvent) => {
        const newFiles = event.type === 'change'
            ? Array.from((event.target as HTMLInputElement).files || [])
            : Array.from((event as DragEvent).dataTransfer.files);

        const validFiles: File[] = [];
        const invalidFiles: AlertMessage[] = [];

        newFiles.forEach(file => {
            if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
                invalidFiles.push({
                    id: Date.now() + Math.random(),
                    message: `<b>${file.name}</b> не PDF/Word документ`,
                    severity: 'error'
                });
            } else if (file.size > MAX_FILE_SIZE) {
                invalidFiles.push({
                    id: Date.now() + Math.random(),
                    message: `<b>${file.name}</b> превышает 5 MБ`,
                    severity: 'error'
                });
            } else if (filesToUpload.length + validFiles.length >= MAX_FILES) {
                invalidFiles.push({
                    id: Date.now() + Math.random(),
                    message: `<b>${file.name}</b> превышает лимит в 6 файлов`,
                    severity: 'error'
                });
            } else {
                validFiles.push(file);
            }
        });

        setAlert(invalidFiles);
        addFiles(validFiles);
    };

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        setDragOver(false);
        handleFileUpload(event);
    };

    const handleDeleteFile = (index: number) => {
        removeFile(index);
    };

    const getIcon = (type: string) => {
        if (type === 'application/pdf') return <PictureAsPdfIcon sx={{ color: '#FF0000' }} />;
        if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <DescriptionIcon sx={{ color: '#2B579A' }} />;
        return null;
    };

    const handleSend = async () => {
        setIsLoading(true);
        setUploadModalOpen(false);
        await uploadFiles();
        await getFiles();
        setIsLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Загрузка документов
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent
                sx={{ overflow: 'auto' }}
            >
                <Typography variant="body2" gutterBottom>
                    Добавьте сюда свои документы. Вы можете загрузить максимум 6 документов.
                </Typography>
                <Box
                    sx={{
                        border: '2px dashed grey',
                        borderRadius: 1,
                        padding: 2,
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: dragOver ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                        mb: 2,
                        minHeight: 100
                    }}
                    onClick={() => document.getElementById('fileInput')?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500' }} />
                    <Typography variant="body1">Перетащите файл сюда</Typography>
                    <Typography variant="body2">5 МБ максимум на каждый файл</Typography>
                </Box>
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                />
                <List>
                    {filesToUpload.map((file, index) => (
                        <ListItem key={index}
                                  secondaryAction={
                                      <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteFile(index)}>
                                          <DeleteIcon />
                                      </IconButton>
                                  }
                        >
                            <ListItemIcon>{getIcon(file.type)}</ListItemIcon>
                            <ListItemText primary={file.name} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions sx={{p: 2}}>
                <Button onClick={handleSend} variant="contained">Отправить</Button>
            </DialogActions>
        </Dialog>
    );
};
