import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem } from '@mui/material';
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";

export interface ConfirmationButtonProps {
    buttonTitle?: string;
    dialogTitle: string;
    dialogContent: string;
    variant?: 'button' | 'menuItem' | 'listItem'
    icon?: any,
    disabled?: boolean;
    fullWidth?: boolean;
    sx?: SxProps<Theme>;
}

interface Props {
    config: ConfirmationButtonProps;
    onSubmit: () => void;
    onClose?: () => void;
    show?: boolean;
    button?: ReactJSXElement;
}

export const ConfirmationButton: React.FC<Props> = ({ config, onSubmit, onClose, show, button }) => {
    const [open, setOpen] = useState(false);

    // Используем useEffect, чтобы обновить состояние, когда изменяется флаг show
    useEffect(() => {
        if (show === false) {
            setOpen(false); // Закрываем модалку, если show равно false
        }
    }, [show]);

    const handleClickOpen = () => {
        if (show !== false) { // Проверяем значение show
            setOpen(true);
        } else {
            onSubmit(); // Если show false, вызываем onSubmit сразу
        }
    };

    const handleMenuItemClick = () => {
        if (show !== false) { // Проверяем значение show
            setOpen(true);
        } else {
            onSubmit(); // Если show false, вызываем onSubmit сразу
        }
    };

    const handleClose = () => {
        setOpen(false);
        onClose && onClose();
    };

    const handleConfirm = () => {
        onSubmit();
        setOpen(false);
        onClose && onClose();
    };

    const renderButton = () => {
        switch (config.variant) {
            case 'menuItem':
                return (
                    <MenuItem onClick={handleClickOpen}>
                        {config.buttonTitle}
                    </MenuItem>
                );
            case 'button':
            default:
                return (
                    <Button
                        disabled={config?.disabled}
                        variant="outlined"
                        color="secondary"
                        fullWidth={config.fullWidth}
                        sx={config.sx}
                        onClick={handleClickOpen}
                    >
                        {config.buttonTitle}
                    </Button>
                );
        }
    };

    return (
        <>
            {renderButton()}

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-content"
            >
                <DialogTitle id="confirmation-dialog-title">{config.dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirmation-dialog-content">
                        <span dangerouslySetInnerHTML={{ __html: config.dialogContent }} />
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
