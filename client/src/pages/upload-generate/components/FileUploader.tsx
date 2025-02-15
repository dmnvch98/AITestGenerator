import React, { useState, ChangeEvent, DragEvent } from 'react';
import { Box, Alert, Typography } from '@mui/material';

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import {DragAndDropZone} from "../../files/components/upload/components/DragAndDropZone";
import {LoadingOverlay} from "../../files/components/upload/components/LoadingOverlay";
import useUploadGenerateStore from "../uploadGenerateStore";

interface FileUploadModalProps {
    isUploading: boolean;
}

export const FileUploader: React.FC<FileUploadModalProps> = ({ isUploading }) => {
    const { filesToUpload, addFilesToUpload, clearFilesToUpload, selectedFile } = useUploadGenerateStore();
    const [dragOver, setDragOver] = useState(false);
    const [hoveredFileIndex, setHoveredFileIndex] = useState<number | null>(null);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement> | DragEvent) => {
        const newFiles =
            event.type === 'change'
                ? Array.from((event.target as HTMLInputElement).files || [])
                : Array.from((event as DragEvent).dataTransfer.files);

        if (newFiles.length === 1) {
            addFilesToUpload(newFiles);
        } else if (newFiles.length > 1) {
            addFilesToUpload([newFiles[0]]);
        }
        if (event.type === 'change') {
            (event.target as HTMLInputElement).value = '';
        }
    };

    const handleDragOver = (event: DragEvent) => {
        if (filesToUpload.length === 0) {
            event.preventDefault();
            setDragOver(true);
        }
    };

    const handleDragLeave = () => setDragOver(false);

    const handleDrop = (event: DragEvent) => {
        if (filesToUpload.length === 0) {
            event.preventDefault();
            setDragOver(false);
            handleFileUpload(event);
        }
    };

    const getIcon = (type: string) => {
        if (type === 'application/pdf') return <PictureAsPdfIcon sx={{ color: '#FF0000' }} />;
        if (
            type === 'application/msword' ||
            type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
            return <DescriptionIcon sx={{ color: '#2B579A' }} />;
        return null;
    };

    return (
        <Box
            sx={{
                height: '50vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
        >
            <Alert severity="info" icon={false} sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                    Изображения в файлах не учитываются при генерации.
                </Typography>
            </Alert>

            {selectedFile &&
                <Typography align="left" sx={{mb: 2}}>
                    <strong>Выбранный файл: </strong> {selectedFile.originalFilename}
                </Typography>
            }

            <Box sx={{ position: 'relative', flexGrow: 1 }}>
                <LoadingOverlay isUploading={isUploading} />

                <DragAndDropZone
                    dragOver={dragOver}
                    filesToUpload={filesToUpload}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => {
                        if (filesToUpload.length === 0) {
                            document.getElementById('fileInput')?.click();
                        }
                    }}
                    hoveredFileIndex={hoveredFileIndex}
                    onFileHover={setHoveredFileIndex}
                    onDeleteFile={clearFilesToUpload}
                    getIcon={getIcon}
                />

                <input
                    id="fileInput"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx"
                />
            </Box>
        </Box>
    );
};
