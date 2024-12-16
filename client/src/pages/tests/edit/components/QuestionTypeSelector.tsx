import {ChangeEvent, useState} from "react";
import {QuestionType, questionTypeTranslations} from "../../../../store/tests/types";
import {FormControl, MenuItem, TextField} from "@mui/material";

export const QuestionTypeSelector = () => {
    const [questionType, setQuestionType] = useState<QuestionType>(
        QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuestionType(event.target.value as unknown as QuestionType);
    };

    return (
        <FormControl fullWidth>
            <TextField
                label="Тип вопроса"
                value={questionType}
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
    );
};