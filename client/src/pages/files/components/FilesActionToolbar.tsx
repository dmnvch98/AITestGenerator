import React from 'react';
import { Box, Button, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {ConfirmationButton} from "../../../components/main/ConfirmationButton";

interface ActionToolbarProps {
    onAdd: () => void;
    onDelete: () => void;
    deleteDisabled: boolean;
    searchValue?: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteButtonTitle?: string;
    addButtonTitle?: string;
}

export const FilesActionToolbar: React.FC<ActionToolbarProps> = ({
                                                                     onAdd,
                                                                     onDelete,
                                                                     deleteDisabled,
                                                                     searchValue,
                                                                     onSearchChange
                                                                 }) => {
    return (
        <Box display="flex" alignItems="center" sx={{ mb: 2 }} justifyContent="space-between">
            <Box display="flex" alignItems="center">
                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    onClick={onAdd}
                >
                    Загрузить файл
                </Button>
                <ConfirmationButton
                    config={{
                        buttonTitle: 'Удалить выбранное',
                        dialogContent: 'Вы уверены что хотите удалить выбранные файлы?',
                        dialogTitle: 'Удаление файлов',
                        variant: 'button',
                        disabled: deleteDisabled
                    }}
                    onSubmit={onDelete}
                />
            </Box>

            <Box sx={{ flex: 1, ml: 'auto', maxWidth: 300 }}>
                <TextField
                    size="small"
                    variant="standard"
                    fullWidth
                    placeholder="Поиск"
                    value={searchValue}
                    onChange={onSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
};
