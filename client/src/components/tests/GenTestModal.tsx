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
    TableRow,
    Alert, CircularProgress,
} from "@mui/material";
import Box from "@mui/material/Box";
import { QuestionType, questionTypeTranslations } from "../../store/tests/types";

interface ModalFormProps {
    selection: Record<QuestionType, { selected: boolean; maxQuestions: number }>;
    setSelection: (selection: Record<QuestionType, { selected: boolean; maxQuestions: number }>) => void;
    open: boolean;
    onClose: () => void;
}

export const GenTestModal: React.FC<ModalFormProps> = ({ open, selection, setSelection }) => {
    const toggleSelection = (type: QuestionType) => {
        setSelection({
            ...selection,
            [type]: {
                ...selection[type],
                selected: !selection[type].selected,
            },
        });
    };

    const handleSelectChange = (type: QuestionType, value: number) => {
        setSelection({
            ...selection,
            [type]: {
                ...selection[type],
                maxQuestions: value,
            },
        });
    };

    const handleRowClick = (type: QuestionType) => {
        toggleSelection(type);
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
    }, [open, setSelection]);

    return (
        <Box>
            <Alert severity="info" icon={false}>
                <Typography variant="body2" gutterBottom>
                    Если в тексте мало информации, число вопросов может уменьшиться.
                </Typography>
            </Alert>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ cursor: "pointer" }}>
                            <TableCell align="center" width="10%">
                                <Typography fontWeight="bold">Выбрать</Typography>
                            </TableCell>
                            <TableCell align="left" width="60%">
                                <Typography fontWeight="bold">Тип вопроса</Typography>
                            </TableCell>
                            <TableCell align="center" width="30%">
                                <Typography fontWeight="bold">Кол-во вопросов</Typography>
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
                                    sx={{ cursor: "pointer" }}
                                >
                                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={selection[type].selected}
                                            onChange={() => toggleSelection(type)}
                                        />
                                    </TableCell>
                                    <TableCell align="left">
                                        <Typography>{label}</Typography>
                                    </TableCell>
                                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                                        <FormControl sx={{width: '100px'}} >
                                            <Select
                                                size="small"
                                                value={selection[type].maxQuestions}
                                                onChange={(e) =>
                                                    handleSelectChange(type, Number(e.target.value))
                                                }
                                                disabled={!selection[type].selected}
                                            >
                                                {[5, 10].map((value) => (
                                                    <MenuItem key={value} value={value}>
                                                        <Typography align="center">
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
    );
};
