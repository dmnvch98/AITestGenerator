import React from 'react';
import {GridColDef} from '@mui/x-data-grid';
import {UserText, useTextStore} from "../../store/textStore";
import {Box, Button, Link} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useTestStore} from "../../store/tests/testStore";
import {DoneLabel} from "../utils/DoneLabel";
import {NoLabel} from "../utils/NoLabel";
import {ConfirmationDialog} from "../main/ConfirmationDialog";
import {GenericTableActions} from "../main/GenericTableActions";

const getActions = (
    text: UserText,
    navigate: ReturnType<typeof useNavigate>,
    deleteText: (id: number) => void,
    generateTest: (id: number) => void) => [
    {
        label: 'Открыть',
        onClick: () => navigate(`/texts/${text.id}`),
    },
    {
        label: 'Редактировать',
        onClick: () => navigate(`/texts/${text.id}?edit`),
    },
    {
        label: 'Удалить',
        onClick: () => deleteText(text.id as number),
    },
    {
        label: 'Сгенерировать тест',
        onClick: () => generateTest(text.id as number),
        disabled: text.testIds != null,
    },
];

export const TextTable = () => {
    const {
        texts,
        deleteInBatch,
        setSelectedIdsToArray,
        selectedTextIds,
        deleteTextFlag,
        setDeleteTextFlag,
        deleteText
    } = useTextStore();
    const {generateTest} = useTestStore();
    const navigate = useNavigate();

    const handleDeleteInBatch = () => {
        setDeleteTextFlag(true);
    };

    const handleConfirmBatchDelete = () => {
        deleteInBatch();
        setDeleteTextFlag(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'title',
            minWidth: 600,
            headerName: 'Заголовок',
            renderCell: (params) => {
                const text: UserText = params.row;
                return (
                    <Link color='inherit' underline='none' href={`/texts/${text.id}`}>
                        {text.title}
                    </Link>
                );
            },
        },
        {
            field: 'test',
            minWidth: 300,
            headerName: 'Тест существует',
            renderCell: (params) => {
                const text: UserText = params.row;
                return text.testIds ? <DoneLabel/> : <NoLabel/>
            },
        },
    ];

    return (
        <Box>
            <Box display="flex" sx={{mb: 2}} justifyContent="flex-start">
                <Button
                    sx={{mr: 2}}
                    variant="outlined"
                    onClick={() => navigate('/add-text')}
                >
                    Добавить
                </Button>

                <Button
                    variant="outlined"
                    disabled={selectedTextIds.length === 0}
                    color="error"
                    onClick={handleDeleteInBatch}
                >
                    Удалить выбранное
                </Button>
            </Box>
            <GenericTableActions<UserText>
                data={texts}
                columns={columns}
                actions={(text) => getActions(text, navigate, deleteText, generateTest)}
                rowIdGetter={(row) => row.id as number}
                onSelectionModelChange={setSelectedIdsToArray}
            />
            <ConfirmationDialog
                open={deleteTextFlag}
                onClose={() => setDeleteTextFlag(false)}
                onConfirm={handleConfirmBatchDelete}
                title="Подтверждение пакетного удаления"
                children="Вы уверены что хотите удалить выбранные тексты? Все связанные с ними сущности будут удалениы"
            />
        </Box>
    );
};
