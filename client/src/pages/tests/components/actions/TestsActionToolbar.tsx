import React from 'react';
import {Box, Button} from '@mui/material';
import {ConfirmationButton} from "../../../../components/main/ConfirmationButton";
import {DebouncedSearchInput} from "../../../../components/main/search/DebouncedSearchInput";

interface ActionToolbarProps {
    onAdd: () => void;
    onDelete: () => void;
    deleteDisabled: boolean;
    onSearchChange: (value: string) => void;
    deleteButtonTitle?: string;
    addButtonTitle?: string;

}

export const TestsActionToolbar: React.FC<ActionToolbarProps> = ({
                                                                     onAdd,
                                                                     onDelete,
                                                                     deleteDisabled,
                                                                     onSearchChange,
                                                                 }) => {
    return (
        <Box display="flex" alignItems="center" sx={{mb: 2}} justifyContent="space-between">
            <Box display="flex" alignItems="center">
                <Button
                    sx={{mr: 2}}
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

            <Box sx={{flex: 1, ml: 'auto', maxWidth: 300}}>
                <DebouncedSearchInput onSearch={onSearchChange}/>
            </Box>
        </Box>
    );
};
