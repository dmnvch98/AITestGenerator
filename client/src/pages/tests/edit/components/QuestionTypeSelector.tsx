import React, {ChangeEvent, useState} from "react";
import {QuestionType, questionTypeTranslations} from "../../../../store/tests/types";
import {FormControl, IconButton, MenuItem, TextField} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from "@mui/material/Box";
import QuestionsExample from "../../../../components/tests/questions/example/QuestionsExample";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from '@mui/icons-material/Close';

interface QuestionTypeSelectorProps {
    value?: QuestionType;
    onChange: (newType: QuestionType) => void;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
                                                                              value,
                                                                              onChange,
                                                                          }) => {
    const [showExample, setShowExample] = useState(false);

    const selectedValue = value !== undefined ? value : QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER;

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        onChange(event.target.value as QuestionType);
    };

    const handleCloseExample = () => {
        setShowExample(false);
    }

    const handleOpenExample = () => {
        setShowExample(true);
    }

    return (
        <Box sx={{display: "flex", alignItems: "center", width: "100%"}}>

            <FormControl fullWidth>
                <TextField
                    label="Тип вопроса"
                    value={selectedValue}
                    onChange={handleChange}
                    variant="standard"
                    select
                    sx={{textAlign: 'left'}}
                    fullWidth
                >
                    {Object.entries(questionTypeTranslations).map(([key, value]) => (
                        <MenuItem key={key} value={key} sx={{
                            textAlign: "left"
                        }}>
                            {value}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
            <IconButton onClick={handleOpenExample}>
                <InfoOutlinedIcon/>
            </IconButton>
            <Dialog
                open={showExample}
                onClose={handleCloseExample}
                fullWidth
                maxWidth="md"
            >
                <IconButton
                    aria-label="close"
                    onClick={handleCloseExample}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon/>
                </IconButton>
                <DialogContent>
                    <QuestionsExample/>
                </DialogContent>

            </Dialog>


        </Box>
    );
};