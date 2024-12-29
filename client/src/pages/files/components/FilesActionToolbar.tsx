import React from 'react';
import { Box } from '@mui/material';
import {ConfirmationButton} from "../../../components/main/ConfirmationButton";
import {DebouncedSearchInput} from "../../../components/main/search/DebouncedSearchInput";

interface ActionToolbarProps {
    onDelete: () => void;
    deleteDisabled: boolean;
    onSearchChange: (value: string) => void;
    deleteButtonTitle?: string;
    addButtonTitle?: string;
}

export const FilesActionToolbar: React.FC<ActionToolbarProps> = ({
                                                                     onDelete,
                                                                     deleteDisabled,
                                                                     onSearchChange
                                                                 }) => {
    return (
        <Box display="flex" alignItems="center" sx={{ mb: 2 }} justifyContent="space-between">
            <Box display="flex" alignItems="center">
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

            <DebouncedSearchInput onSearch={onSearchChange} />
        </Box>
    );
};
