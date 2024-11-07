import React, {useState} from "react";
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {ActionIcon} from "../../../../store/types";
import {getActionItemsList} from "../../../../components/main/data-display/helper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';

interface Props {
    onEdit: () => void;
    isLoading: boolean;
    onExit: () => void;
    onPrint: () => void;
    onExport: () => void;
    onDelete: () => void;
}

export const TestViewActions: React.FC<Props> = ({onEdit, isLoading, onExit, onPrint, onExport, onDelete}) => {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState<{
        title: string;
        content: string;
        onConfirm: () => void
    } | null>(null);

    const openDialog = (title: string, content: string, onConfirm: () => void) => {
        setDialogConfig({title, content, onConfirm});
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setDialogConfig(null);
    };

    const tabs: ActionIcon[] = [
        {
            name: 'Редактировать',
            icon: <EditIcon/>,
            disabled: isLoading,
            onClick: onEdit
        },
        {
            name: 'Экспорт',
            icon: <FileUploadIcon/>,
            disabled: isLoading,
            onClick: onExport
        },
        {
            name: 'Печать',
            icon: <PrintIcon/>,
            disabled: isLoading,
            onClick: onPrint
        },
        {
            name: 'Удалить',
            icon: <DeleteIcon/>,
            onClick: () => {
                openDialog(
                    'Подтвердите удаление',
                    'Вы уверены, что хотите удалить тест?',
                    () => {
                        onDelete();
                        onExit();
                    }
                )
            }
        },
        {
            name: 'Выйти',
            icon: <ExitToAppOutlinedIcon/>,
            onClick: onExit
        },
    ];
    return (
        <div>
            {getActionItemsList(tabs)}

            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                aria-labelledby="confirmation-dialog-title"
                aria-describedby="confirmation-dialog-content"
            >
                {dialogConfig && (
                    <>
                        <DialogTitle id="confirmation-dialog-title">{dialogConfig.title}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="confirmation-dialog-content">
                                {dialogConfig.content}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeDialog}>
                                Отмена
                            </Button>
                            <Button onClick={() => {
                                dialogConfig.onConfirm();
                                closeDialog();
                            }} color="primary">
                                Подтвердить
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </div>
    );
}