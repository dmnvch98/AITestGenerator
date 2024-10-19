import React from 'react';
import {Button, Tooltip} from "@mui/material";
import {ConfirmationButton} from "../../../../components/main/ConfirmationButton";

interface ActionButtonsProps {
    onSave: () => void;
    onAddQuestion: () => void;
    onReset: () => void;
    onExit: () => void;
    isTestModified: boolean;
    isLoading: boolean;
}

export const TestFormActions: React.FC<ActionButtonsProps> = ({onSave, onAddQuestion, onReset, onExit, isTestModified, isLoading}) => {
    return (
        <>
            <Button sx={{mb: 2, width: "100%"}} variant="contained" onClick={onSave} disabled={!isTestModified || isLoading}>
                Сохранить
            </Button>
            <Button sx={{mb: 2, width: "100%"}} variant="outlined" color="primary" onClick={onAddQuestion} disabled={isLoading}>
                Добавить вопрос
            </Button>
            <Tooltip title="Сбрасывает несохраненные изменения" enterDelay={500} leaveDelay={200}>
        <span>
            <ConfirmationButton
                config={{
                    buttonTitle: "Сбросить",
                    dialogTitle: "Подтверждение сброса",
                    dialogContent: "Вы уверены, что хотите сбросить тест до последнего сохранненого состояния? Все несохраненные изменения будут потеряны.",
                    variant: "button",
                    disabled: !isTestModified || isLoading,
                    fullWidth: true,
                    sx: {mb: 2}
                }}
                onSubmit={onReset}
            />
        </span>
            </Tooltip>
            <ConfirmationButton
                config={{
                    buttonTitle: "Выйти",
                    dialogTitle: "Подтверждение выхода",
                    dialogContent: "Вы уверены, что хотите выйти? Все несохраненные изменения будут потеряны.",
                    variant: "button",
                    fullWidth: true,
                    sx: {mb: 2}
                }}
                onSubmit={onExit}
                show={isTestModified}
            />
        </>
    );
};
