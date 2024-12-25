import React, { useEffect, useState } from "react";
import {
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import {QuestionType, questionTypeTranslations} from "../../store/tests/types";
import Box from "@mui/material/Box";

interface ModalFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        selection: Record<QuestionType, { selected: boolean; maxQuestions: number }>
    ) => void;
}

export const GenTestModal: React.FC<ModalFormProps> = ({ open, onClose, onSubmit }) => {
    const [selection, setSelection] = useState<Record<QuestionType, { selected: boolean; maxQuestions: number }>>(
        Object.keys(QuestionType).reduce((acc, key) => {
            acc[key as unknown as QuestionType] = { selected: false, maxQuestions: 10 };
            return acc;
        }, {} as Record<QuestionType, { selected: boolean; maxQuestions: number }>)
    );

    const toggleSelection = (type: QuestionType) => {
        const updatedSelection = {
            ...selection,
            [type]: {
                ...selection[type],
                selected: !selection[type].selected,
            },
        };
        setSelection(updatedSelection);
    };

    const handleSelectChange = (type: QuestionType, value: number) => {
        const updatedSelection = {
            ...selection,
            [type]: {
                ...selection[type],
                maxQuestions: value,
            },
        };
        setSelection(updatedSelection);
    };

    const handleRowClick = (type: QuestionType) => {
        toggleSelection(type);
    };

    const handleSubmit = () => {
        onSubmit(selection);
    };

    useEffect(() => {
        if (!open) {
            setSelection(
                Object.keys(QuestionType).reduce((acc, key) => {
                    acc[key as unknown as QuestionType] = { selected: false, maxQuestions: 5 };
                    return acc;
                }, {} as Record<QuestionType, { selected: boolean; maxQuestions: number }>)
            );
        }
    }, [open]);

    return (
            <Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ cursor: 'pointer' }}>
                                <TableCell align="center" width="10%">
                                    <Typography fontWeight="bold">Выбрать</Typography>
                                </TableCell>
                                <TableCell align="left" width="60%">
                                    <Typography fontWeight="bold">Тип вопроса</Typography>
                                </TableCell>
                                <TableCell align="center" width="30%">
                                    <Typography fontWeight="bold">Кол-во ответов</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(questionTypeTranslations).map(([key, label]) => {
                                const type = key as unknown as QuestionType;
                                return (
                                    <TableRow key={type} hover onClick={() => handleRowClick(type)} sx={{ cursor: 'pointer' }}>
                                        <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                            <Checkbox
                                                checked={selection[type].selected}
                                                onChange={() => toggleSelection(type)}
                                            />
                                        </TableCell>
                                        <TableCell align="left">
                                            <Typography>{label}</Typography>
                                        </TableCell>
                                        <TableCell size="small" align="center" onClick={(e) => e.stopPropagation()}>
                                            <FormControl fullWidth>
                                                <Select
                                                    size="small"
                                                    value={selection[type].maxQuestions}
                                                    onChange={(e) => handleSelectChange(type, Number(e.target.value))}
                                                    disabled={!selection[type].selected}
                                                >
                                                    {[...Array(10)].map((_, index) => (
                                                        <MenuItem key={index + 1} value={index + 1}>
                                                            {index + 1}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            // <DialogActions sx={{ p: 2 }}>
            //     <Button onClick={onClose} variant="outlined" fullWidth>
            //         Отменить
            //     </Button>
            //     <Button
            //         onClick={handleSubmit}
            //         variant="contained"
            //         color="primary"
            //         fullWidth
            //         disabled={isGenerateDisabled}
            //     >
            //         Сгенерировать
            //     </Button>
            // </DialogActions>
        // </Box>
    );
};
