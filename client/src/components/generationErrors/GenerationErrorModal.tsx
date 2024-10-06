import React, { useEffect, useState } from 'react';
import {

    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import errorsData from './errors.json';

interface ErrorInfo {
    code: string;
    description: string;
    steps: string;
    type: string;
}

interface ErrorModalProps {
    failCode: number | null;
    open: boolean;
    onClose: () => void;
}

export const GenerationErrorModal: React.FC<ErrorModalProps> = ({ failCode, open, onClose }) => {
    const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);

    useEffect(() => {
        if (open && failCode !== null) {
            const foundError = errorsData.errors.find((error: ErrorInfo) => error.code === failCode?.toString());
            setErrorInfo(foundError || null);
        } else {
            setErrorInfo(null); // Сбрасываем информацию об ошибке при закрытии
        }
    }, [failCode, open]);

    return (
        <Dialog open={open} onClose={onClose}>
                {errorInfo ? (
                    <>
                        <DialogTitle>Код ошибки: {errorInfo.code}</DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={(theme) => ({
                                position: 'absolute',
                                right: 16,
                                top: 16,
                                color: theme.palette.grey[500],
                            })}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent>
                            <DialogContentText><strong>Описание:</strong> {errorInfo.description}</DialogContentText>
                            <DialogContentText sx={{mt: 2}}><strong>Шаги:</strong> {errorInfo.steps}</DialogContentText>
                        </DialogContent>
                    </>
                ) : (
                    <Typography variant="body1">Неизвестный код ошибки.</Typography>
                )}
        </Dialog>
    );
};
