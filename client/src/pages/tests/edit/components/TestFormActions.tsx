import React, {useState} from 'react';
import {ActionIcon} from "../../../../store/types";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import RestoreIcon from '@mui/icons-material/Restore';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import {getActionItemsList} from "../../../../components/main/data-display/helper";

interface ActionButtonsProps {
    onSave: () => void;
    onAddQuestion: () => void;
    onUndo: () => void;
    onExit: () => void;
    isTestModified: boolean;
    isLoading: boolean;
    onReturn: () => void;
    undoActionsAvailable: boolean;
}

export const TestFormActions: React.FC<ActionButtonsProps> = ({
                                                                  onSave,
                                                                  onAddQuestion,
                                                                  onUndo,
                                                                  onExit,
                                                                  isTestModified,
                                                                  isLoading,
                                                                  onReturn,
                                                                  undoActionsAvailable
                                                              }) => {
    const [dialogOpen, setDialogOpen] = useState(false); // Состояние для диалога
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

    const actions: ActionIcon[] = [
        {
            name: 'Сохранить',
            icon: <SaveAltIcon/>,
            onClick: onSave,
            disabled: !isTestModified || isLoading
        },
        {
            name: 'Новый вопрос',
            icon: <QuestionMarkIcon/>,
            onClick: onAddQuestion,
            disabled: isLoading
        },
        {
            name: 'Отменить',
            icon: <RestoreIcon />,
            onClick: onUndo,
            disabled: isLoading || !undoActionsAvailable
        },
        {
            name: 'Вернуться',
            icon: <ArrowBackIcon/>,
            onClick: () => {
                isTestModified
                    ? openDialog(
                        'Подтвердите возвращение на прошлую страницу',
                        'Вы уверены, что хотите вернуться? Все несохраненные изменения будут потеряны.',
                        onReturn
                    )
                    : onReturn()
            }
        },
        {
            name: 'Выйти',
            icon: <ExitToAppOutlinedIcon/>,
            onClick: () => {
                isTestModified
                    ? openDialog(
                        'Подтвердите выход',
                        'Вы уверены, что хотите выйти? Все несохраненные изменения будут потеряны.',
                        onExit
                    )
                    : onExit()
            }
        },
    ];

    return (
        <div>
            {getActionItemsList(actions)}

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
};
