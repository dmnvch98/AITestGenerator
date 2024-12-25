import React, { useEffect } from "react";
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
    TableRow, Alert,
} from "@mui/material";

import {QuestionType, questionTypeTranslations} from "../../store/tests/types";
import Box from "@mui/material/Box";

interface ModalFormProps {
    selection: Record<QuestionType, { selected: boolean; maxQuestions: number }>,
    setSelection: (selection: Record<QuestionType, { selected: boolean; maxQuestions: number }>) => void;
    open: boolean;
    onClose: () => void;
}

export const GenTestModal: React.FC<ModalFormProps> = ({ open, selection, setSelection }) => {
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

    // const handleSubmit = () => {
    //     onSubmit(selection);
    // };

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
                <Alert severity="info" icon={false} sx={{mb: 2}}>
                    <Typography variant="body2" gutterBottom>
                        Если в тексте мало информации, число вопросов может уменьшиться.
                    </Typography>
                </Alert>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ cursor: 'pointer', height: '50px' }}>
                                <TableCell align="center" width="10%" sx={{ padding: '4px' }}>
                                    <Typography fontWeight="bold" fontSize="0.875rem">Выбрать</Typography>
                                </TableCell>
                                <TableCell align="left" width="60%" sx={{ padding: '4px' }}>
                                    <Typography fontWeight="bold" fontSize="0.875rem">Тип вопроса</Typography>
                                </TableCell>
                                <TableCell align="center" width="30%" sx={{ padding: '4px' }}>
                                    <Typography fontWeight="bold" fontSize="0.875rem">Кол-во вопросов</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(questionTypeTranslations).map(([key, label]) => {
                                const type = key as unknown as QuestionType;
                                return (
                                    <TableRow
                                        key={type}
                                        hover
                                        onClick={() => handleRowClick(type)}
                                        sx={{ cursor: 'pointer', height: '60px' }}
                                    >
                                        <TableCell
                                            align="center"
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{ padding: '4px' }}
                                        >
                                            <Checkbox
                                                checked={selection[type].selected}
                                                onChange={() => toggleSelection(type)}
                                                sx={{ padding: '4px' }}
                                            />
                                        </TableCell>
                                        <TableCell align="left" sx={{ padding: '4px' }}>
                                            <Typography fontSize="0.875rem">{label}</Typography>
                                        </TableCell>
                                        <TableCell
                                            size="small"
                                            align="center"
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{ padding: '4px' }}
                                        >
                                            <FormControl sx={{width: '70%'}}>
                                                <Select
                                                    size="small"
                                                    value={selection[type].maxQuestions}
                                                    onChange={(e) => handleSelectChange(type, Number(e.target.value))}
                                                    disabled={!selection[type].selected}
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        height: '36px',
                                                    }}
                                                >
                                                    {[5, 10].map((value) => (
                                                        <MenuItem
                                                            key={value}
                                                            value={value}
                                                            sx={{
                                                                fontSize: '0.875rem',
                                                                padding: '4px',
                                                            }}
                                                        >
                                                            <Typography sx={{ textAlign: 'center', width: '100%' }}>
                                                                {value}
                                                            </Typography>
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
