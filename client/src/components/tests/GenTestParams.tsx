import React, {useEffect} from "react";
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
    Alert
} from "@mui/material";
import Box from "@mui/material/Box";
import {QuestionType, questionTypeTranslations} from "../../store/tests/types";
import {LoadingOverlay} from "../../pages/files/components/upload/components/LoadingOverlay";

interface ModalFormProps {
    selection: Record<QuestionType, { selected: boolean; maxQuestions: number }>;
    setSelection: (selection: Record<QuestionType, { selected: boolean; maxQuestions: number }>) => void;
    open: boolean;
    onClose: () => void;
    selectedFileName?: string;
    isQueueing: boolean;
}

export const GenTestParams: React.FC<ModalFormProps> = ({
                                                            open,
                                                            selection,
                                                            setSelection,
                                                            selectedFileName,
                                                            isQueueing
                                                        }) => {
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
                    acc[key as unknown as QuestionType] = {selected: false, maxQuestions: 5};
                    return acc;
                }, {} as Record<QuestionType, { selected: boolean; maxQuestions: number }>)
            );
        }
    }, [open, setSelection]);

    return (
        <Box>
            <Alert severity="info" icon={false} sx={{mt: 2}}>
                <Typography variant="body2" gutterBottom>
                    Если в тексте мало информации, число вопросов может уменьшиться.
                </Typography>
            </Alert>
            <Typography align="left" variant="subtitle1" sx={{mt: 2}}>
                <strong>Выбранный файл: </strong> {selectedFileName}
            </Typography>
            <Box sx={{position: 'relative', flexGrow: 1, mt: 2}}>
                <LoadingOverlay isUploading={isQueueing}/>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
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
                                        sx={{cursor: "pointer", height: "60px"}}
                                    >
                                        <TableCell
                                            align="center"
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{padding: "4px"}}
                                        >
                                            <Checkbox
                                                checked={selection[type].selected}
                                                onChange={() => toggleSelection(type)}
                                                sx={{padding: "4px"}}
                                            />
                                        </TableCell>
                                        <TableCell align="left" sx={{padding: "4px"}}>
                                            <Typography fontSize="0.875rem">{label}</Typography>
                                        </TableCell>
                                        <TableCell
                                            align="center"
                                            onClick={(e) => e.stopPropagation()}
                                            sx={{padding: "4px"}}
                                        >
                                            <FormControl sx={{width: "70%"}}>
                                                <Select
                                                    size="small"
                                                    value={selection[type].maxQuestions}
                                                    onChange={(e) => handleSelectChange(type, Number(e.target.value))}
                                                    // disabled={!selection[type].selected}
                                                    sx={{
                                                        fontSize: "0.875rem",
                                                        height: "36px",
                                                    }}
                                                >
                                                    {[5, 10].map((value) => (
                                                        <MenuItem
                                                            key={value}
                                                            value={value}
                                                            sx={{
                                                                fontSize: "0.875rem",
                                                                padding: "4px",
                                                            }}
                                                        >
                                                            <Typography sx={{textAlign: "center", width: "100%"}}>
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
        </Box>
    );
};
