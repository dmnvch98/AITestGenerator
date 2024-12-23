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
    Alert,
    Divider,
    CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import useFileStore from "../store/fileStore";

interface FileUploadModalProps {
    open: boolean;
    onClose: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({ open, onClose }) => {
    const {
        filesToUpload,
        removeFile,
        uploadFiles,
        setUploadModalOpen,
        validateFilesThenUpload
    } = useFileStore();
    const [dragOver, setDragOver] = useState(false);
    const [upload, setUpload] = useState(false);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement> | DragEvent) => {
        const newFiles = event.type === 'change'
            ? Array.from((event.target as HTMLInputElement).files || [])
            : Array.from((event as DragEvent).dataTransfer.files);

        validateFilesThenUpload(newFiles);
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
        if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <DescriptionIcon
            sx={{ color: '#2B579A' }} />;
        return null;
    };

    const handleSend = async () => {
        setUpload(true);
        await uploadFiles();
        setUploadModalOpen(false);
        setUpload(false);
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
                <Alert severity="info" icon={false} sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        <b>Требования к файлу:</b> до 5 страниц формата А4 с шрифтом Time New Roman и размером текста
                        14.
                        <br />
                        Добавьте сюда свои документы. Вы можете загрузить максимум 5 документов.
                    </Typography>
                </Alert>

                <Box
                    sx={{
                        position: 'relative',
                    }}
                >
                    {upload && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: '50%',
                                backgroundColor: '#fff',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 1,
                            }}
                        >
                            <CircularProgress color="inherit" />
                        </Box>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed grey',
                            borderRadius: 1,
                            padding: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            backgroundColor: dragOver ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                            minHeight: 200,
                            zIndex: 0,
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
                            <>
                                <ListItem key={index}
                                          secondaryAction={
                                              <IconButton edge="end" aria-label="delete" disabled={upload}
                                                          onClick={() => handleDeleteFile(index)}>
                                                  <DeleteIcon />
                                              </IconButton>
                                          }
                                >
                                    <ListItemIcon>{getIcon(file.type)}</ListItemIcon>
                                    <ListItemText primary={file.name} />
                                </ListItem>
                                {index < filesToUpload.length - 1 && <Divider />}
                            </>
                        ))}
                    </List>
                </Box>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                <Button disabled={upload} onClick={handleSend} variant="contained" sx={{ width: '150px' }}>Отправить</Button>
            </DialogActions>
        </Dialog>
    );
};
