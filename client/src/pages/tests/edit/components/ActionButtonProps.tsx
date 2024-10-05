import React from 'react';
import {Button, Tooltip} from "@mui/material";

interface ActionButtonsProps {
    onSave: () => void;
    onAddQuestion: () => void;
    onReset: () => void;
    onExit: () => void;
}

export const TestFormActionButtons: React.FC<ActionButtonsProps> = ({onSave, onAddQuestion, onReset, onExit}) => {
    return (
        <>
            <Button sx={{mb: 2, width: "100%"}} variant="contained" onClick={onSave}>
                Сохранить
            </Button>
            <Button sx={{mb: 2, width: "100%"}} variant="outlined" color="primary" onClick={onAddQuestion}>
                Добавить вопрос
            </Button>
            <Tooltip title="Сбрасывает состояние до последнего сохраненного" enterDelay={500} leaveDelay={200}>
        <span>
          <Button sx={{mb: 2, width: "100%"}} variant="outlined" color="secondary" onClick={onReset}>
            Сбросить
          </Button>
        </span>
            </Tooltip>
            <Button fullWidth variant="outlined" color="secondary" onClick={onExit}>
                Выйти
            </Button>
        </>
    );
};
