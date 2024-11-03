import React from 'react';
import {Box, Button} from '@mui/material';
import {ConfirmationButton} from "../../../../components/main/ConfirmationButton";
import {SearchInput} from "../../../../components/main/search/SearchInput";

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

            <SearchInput searchValue={searchValue} onSearchChange={onSearchChange} onSearchClear={onSearchClear}/>
        </Box>
    );
};
