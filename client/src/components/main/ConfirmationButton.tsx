import React, { useState } from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem} from '@mui/material';

export interface ConfirmationButtonProps {
    buttonTitle: string;
    dialogTitle: string;
    dialogContent: string;
    variant: 'button' | 'menuItem';
    disabled?: boolean
}

interface Props {
    config: ConfirmationButtonProps;
    onSubmit: () => void;
    onClose?: () => void;
}

export const ConfirmationButton: React.FC<Props> = ({ config, onSubmit, onClose }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleMenuItemClick = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        onClose && onClose();
    };

    const handleConfirm = () => {
        onSubmit();
        setOpen(false);
        onClose && onClose();
    };

    return (
        <>
            {config.variant === 'menuItem'
                ? <MenuItem
                    onClick={handleMenuItemClick}>
                    {config.buttonTitle}
                </MenuItem>
                :
                <Button
                    disabled={config?.disabled}
                    variant="outlined"
                    color="secondary"
                    onClick={handleClickOpen}>
                    {config.buttonTitle}
                </Button>
            }

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-content"
            >
                <DialogTitle id="confirmation-dialog-title">{config.dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirmation-dialog-content">
                        <span dangerouslySetInnerHTML={{__html: config.dialogContent}}/>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
