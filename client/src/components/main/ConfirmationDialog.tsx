import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onClose, onConfirm, title, content }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Отмена
                </Button>
                <Button onClick={onConfirm} color="primary" autoFocus>
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );
};
