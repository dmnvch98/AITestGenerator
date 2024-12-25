import React, { DragEvent } from 'react';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

interface DragAndDropZoneProps {
    dragOver: boolean;
    filesToUpload: File[];
    onDrop: (event: DragEvent) => void;
    onDragOver: (event: DragEvent) => void;
    onDragLeave: () => void;
    onClick: () => void;
    hoveredFileIndex: number | null;
    onFileHover: (index: number | null) => void;
    onDeleteFile: (index: number) => void;
    getIcon: (type: string) => JSX.Element | null;
}

export const DragAndDropZone: React.FC<DragAndDropZoneProps> = ({
                                                                    dragOver,
                                                                    filesToUpload,
                                                                    onDrop,
                                                                    onDragOver,
                                                                    onDragLeave,
                                                                    onClick,
                                                                    hoveredFileIndex,
                                                                    onFileHover,
                                                                    onDeleteFile,
                                                                    getIcon,
                                                                }) => (
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
        onClick={onClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
    >
        {filesToUpload.length === 0 ? (
            <>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.500' }} />
                <Typography variant="body1">
                    Перетащите файл сюда или нажмите для выбора
                </Typography>
                <Typography variant="body2">5 МБ максимум на файл</Typography>
            </>
        ) : (
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
                            onMouseEnter={() => onFileHover(index)}
                            onMouseLeave={() => onFileHover(null)}
                        >
                            {getIcon(file.type)}
                            <Typography variant="caption" sx={{ mt: 1, wordBreak: 'break-all' }}>
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
                                        onDeleteFile(index);
                                    }}
                                >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        )}
    </Box>
);
