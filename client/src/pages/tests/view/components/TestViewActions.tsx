import React from "react";
import PrintIcon from '@mui/icons-material/Print';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {ActionIcon} from "../../../../store/types";
import {getActionItemsList} from "../../../../components/main/data-display/helper";

interface Props {
    onEdit: () => void;
    isLoading: boolean;
    onExit: () => void;
    onPrint: () => void;
    onExport: () => void;
}

export const TestViewActions: React.FC<Props> = ({onEdit, isLoading, onExit, onPrint, onExport}) => {
    const tabs: ActionIcon[] = [
        {
            name: 'Редактировать',
            icon: <EditIcon />,
            disabled: isLoading,
            onClick: onEdit
        },
        {
            name: 'Экспорт',
            icon: <FileUploadIcon />,
            disabled: isLoading,
            onClick: onExport
        },
        {
            name: 'Печать',
            icon: <PrintIcon />,
            disabled: isLoading,
            onClick: onPrint
        },
        {
            name: 'Выйти',
            icon: <ArrowBackIcon />,
            onClick: onExit
        }
    ];
    return getActionItemsList(tabs);
}