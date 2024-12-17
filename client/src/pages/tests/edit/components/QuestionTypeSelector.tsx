import React, {ChangeEvent} from "react";
import {QuestionType, questionTypeTranslations} from "../../../../store/tests/types";
import {FormControl, IconButton, MenuItem, TextField} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Box from "@mui/material/Box";

interface QuestionTypeSelectorProps {
    value?: QuestionType;
    onChange: (newType: QuestionType) => void;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
                                                                              value,
                                                                              onChange,
                                                                          }) => {

    const selectedValue = value !== undefined ? value : QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER;

    const handleChange = (event: ChangeEvent<{ value: unknown }>) => {
        onChange(event.target.value as QuestionType);
    };

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
            <IconButton>
                <InfoOutlinedIcon/>
            </IconButton>
        </Box>
    );
};