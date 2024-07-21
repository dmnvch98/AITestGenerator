import { FormControlLabel, FormGroup, ListItem, Switch, IconButton } from "@mui/material";
import List from "@mui/material/List";
import React from "react";
import { AnswerOption } from "../../../store/tests/testStore";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";

const AnswerOptionEdit = ({ answerOption, onOptionChange, onDelete }: { answerOption: AnswerOption, onOptionChange: (option: AnswerOption) => void, onDelete: () => void }) => {
    const handleOptionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedOption = { ...answerOption, optionText: e.target.value };
        onOptionChange(updatedOption);
    };

    const handleCorrectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onOptionChange({ ...answerOption, isCorrect: e.target.checked });
    };

    return (
        <List>
            <ListItem sx={{pl:4, pr: 4}}>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center'}}>
                        <TextField
                            multiline
                            id="standard-basic"
                            variant="standard"
                            value={answerOption.optionText}
                            onChange={handleOptionTextChange}
                            fullWidth
                        />
                        <IconButton onClick={onDelete} edge="end">
                            <ClearIcon />
                        </IconButton>
                    </Box>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={answerOption.isCorrect} onChange={handleCorrectChange} />}
                            label="Верно"
                        />
                    </FormGroup>
                </Box>
            </ListItem>
        </List>
    );
};

export default AnswerOptionEdit;
