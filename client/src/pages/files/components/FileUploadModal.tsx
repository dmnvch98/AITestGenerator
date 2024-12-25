// FileUploadModal.tsx
import React, {useState, ChangeEvent, DragEvent} from 'react';
import {
    Box,
    IconButton,
    Typography,
    Alert,
    CircularProgress,
    Grid,
    Button,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import useFileStore from "../store/fileStore";

interface FileUploadModalProps {
    onUploadSuccess: () => void;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({onUploadSuccess}) => {
    const {
        filesToUpload,
        removeFile,
        uploadFiles,
        validateFilesThenUpload
    } = useFileStore();
    const [dragOver, setDragOver] = useState(false);
    const [upload, setUpload] = useState(false);
    const [hoveredFileIndex, setHoveredFileIndex] = useState<number | null>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement> | DragEvent) => {
        const newFiles = event.type === 'change'
            ? Array.from((event.target as HTMLInputElement).files || [])
            : Array.from((event as DragEvent).dataTransfer.files);

        if (newFiles.length === 1) {
            validateFilesThenUpload(newFiles);
        } else if (newFiles.length > 1) {
            validateFilesThenUpload([newFiles[0]]);
        }
    };

    const handleDragOver = (event: DragEvent) => {
        if (filesToUpload.length === 0) {
            event.preventDefault();
            setDragOver(true);
        }
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (event: DragEvent) => {
        if (filesToUpload.length === 0) {
            event.preventDefault();
            setDragOver(false);
            handleFileUpload(event);
        }
    };

    const handleDeleteFile = (index: number) => {
        removeFile(index);
    };

    const getIcon = (type: string) => {
        if (type === 'application/pdf') return <PictureAsPdfIcon sx={{color: '#FF0000'}}/>;
        if (type === 'application/msword' || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return <DescriptionIcon
            sx={{color: '#2B579A'}}/>;
        return null;
    };

    const handleNext = async () => {
        setUpload(true);
        try {
            const success = await uploadFiles();
            if (success) {
                onUploadSuccess();
            }
        } catch (error) {
            console.error("Ошибка загрузки файлов:", error);
        } finally {
            setUpload(false);
        }
    };

    return (
        <Box
            sx={{
                height: '60vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Alert severity="info" icon={false} sx={{mb: 2}}>
                <Typography variant="body2" gutterBottom>
                    Загрузите текстовый файл для генерации теста. Изображения не учитываются.
                </Typography>
            </Alert>

            <Box
                sx={{
                    position: 'relative',
                    flexGrow: 1,
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
                        <CircularProgress color="inherit"/>
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
                        cursor: filesToUpload.length === 0 ? 'pointer' : 'default',
                        backgroundColor: dragOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                        minHeight: '40vh',
                        transition: 'background-color 0.3s, box-shadow 0.3s',
                        position: 'relative',
                    }}
                    onClick={() => {
                        if (filesToUpload.length === 0) {
                            document.getElementById('fileInput')?.click();
                        }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {filesToUpload.length === 0 && (
                        <>
                            <CloudUploadIcon sx={{fontSize: 48, color: 'grey.500'}}/>
                            <Typography variant="body1">Перетащите файл сюда или нажмите для выбора</Typography>
                            <Typography variant="body2">5 МБ максимум на файл</Typography>
                        </>
                    )}

                    {filesToUpload.length === 1 && (
                        <Grid container spacing={2} justifyContent="center">
                            {filesToUpload.map((file, index) => (
                                <Grid item key={index}>
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            width: 120,
                                            height: 120,
                                            border: '1px solid #ccc',
                                            borderRadius: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 1,
                                            transition: 'border-color 0.3s, box-shadow 0.3s',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: 3,
                                            },
                                        }}
                                        onMouseEnter={() => setHoveredFileIndex(index)}
                                        onMouseLeave={() => setHoveredFileIndex(null)}
                                    >
                                        {getIcon(file.type)}
                                        <Typography variant="caption" sx={{mt: 1, wordBreak: 'break-all'}}>
                                            {file.name}
                                        </Typography>
                                        {hoveredFileIndex === index && (
                                            <IconButton
                                                size="small"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                                    },
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteFile(index);
                                                }}
                                            >
                                                <ClearIcon fontSize="small"/>
                                            </IconButton>
                                        )}
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                <input
                    id="fileInput"
                    type="file"
                    style={{display: 'none'}}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                />
            </Box>

            <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2}}>
                <Button
                    sx={{width: 'auto'}}
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={filesToUpload.length === 0 || upload}
                >
                    Дальше
                </Button>
            </Box>
        </Box>
    );
};
