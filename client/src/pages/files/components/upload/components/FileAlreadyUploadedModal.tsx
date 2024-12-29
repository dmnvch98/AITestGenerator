import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
        <DialogTitle>
            Файл уже загружен
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                }}
            >
                <CloseIcon />
            </IconButton>
        </DialogTitle>        <DialogContent>
            <Typography>
                Этот файл уже был загружен ранее. Вы можете перезаписать его или создать копию.
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCreateCopy} color="primary" sx={{mr: 4}}>
                Создать копию
            </Button>
            <Button onClick={onOverride} color="primary" variant="contained">
                Перезаписать
            </Button>
        </DialogActions>
    </Dialog>
);
