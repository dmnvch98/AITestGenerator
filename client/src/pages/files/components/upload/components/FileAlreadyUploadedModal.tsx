import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

interface FileAlreadyUploadedModalProps {
    open: boolean;
    onClose: () => void;
    onOverride: () => void;
    onCreateCopy: () => void;
}

export const FileAlreadyUploadedModal: React.FC<FileAlreadyUploadedModalProps> = ({
                                                                                      open,
                                                                                      onClose,
                                                                                      onOverride,
                                                                                      onCreateCopy,
                                                                                  }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Файл уже загружен</DialogTitle>
        <DialogContent>
            <Typography>
                Этот файл уже был загружен ранее. Вы можете перезаписать его или создать копию.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="secondary">
                Отмена
            </Button>
            <Button onClick={onOverride} color="primary">
                Перезаписать
            </Button>
            <Button onClick={onCreateCopy} color="primary">
                Создать копию
            </Button>
        </DialogActions>
    </Dialog>
);
