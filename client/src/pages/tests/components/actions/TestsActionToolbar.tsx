import React from 'react';
import {Box, Button, TextField, InputAdornment, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {ConfirmationButton} from "../../../../components/main/ConfirmationButton";
import CancelIcon from '@mui/icons-material/Cancel';

interface ActionToolbarProps {
    onAdd: () => void;
    onDelete: () => void;
    deleteDisabled: boolean;
    searchValue?: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    deleteButtonTitle?: string;
    addButtonTitle?: string;
    onSearchClear: () => void;
}
export const TestsActionToolbar: React.FC<ActionToolbarProps> = ({
                                                         onAdd,
                                                         onDelete,
                                                         deleteDisabled,
                                                         searchValue,
                                                         onSearchChange,
                                                         onSearchClear
                                                     }) => {
    return (
        <Box display="flex" alignItems="center" sx={{ mb: 2 }} justifyContent="space-between">
            <Box display="flex" alignItems="center">
                <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    onClick={onAdd}
                >
                    Создать тест
                </Button>
                <ConfirmationButton
                    config={{
                        buttonTitle: 'Удалить выбранное',
                        dialogContent: 'Вы уверены что хотите удалить выбранные тесты?',
                        dialogTitle: 'Удаление тестов',
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
                        endAdornment: (
                            <InputAdornment position="end">
                                {searchValue && searchValue?.length > 0 && (
                                    <IconButton onClick={onSearchClear}>
                                        <CancelIcon sx={{fontSize: 14}}/>
                                    </IconButton>
                                )}
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
};
