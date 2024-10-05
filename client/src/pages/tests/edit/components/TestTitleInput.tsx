import React from 'react';
import TextField from "@mui/material/TextField";

interface TestTitleInputProps {
    title: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

export const TestTitleInput: React.FC<TestTitleInputProps> = ({ title, onChange, error }) => {
    return (
        <TextField
            label="Заголовок теста"
            placeholder="Введите заголовок теста"
            fullWidth
            multiline
            value={title}
            variant="standard"
            onChange={onChange}
            sx={{
                "& .MuiInputBase-input": {
                    fontWeight: 600,
                    fontSize: "22px",
                }
            }}
            error={!!error}
            helperText={error}
        />
    );
};
