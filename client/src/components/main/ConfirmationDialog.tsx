import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    IconButton,
    Typography,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

interface ConfirmationDialogProps {
    open: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    title: string;
    children: React.ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
                                                                          open,
                                                                          onClose,
                                                                          onConfirm,
                                                                          title,
                                                                          children
                                                                      }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }}>
                <Typography variant="h6">{title}</Typography>
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
            </DialogTitle>
            <DialogContent>
                {children}
            </DialogContent>
            <DialogActions>
                {onConfirm && (
                    <Button onClick={onConfirm} color="primary" autoFocus>
                        Подтвердить
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};
