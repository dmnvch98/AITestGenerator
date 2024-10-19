import React from 'react';
import TextField from "@mui/material/TextField";
import { Skeleton } from "@mui/material";
import Typography from "@mui/material/Typography";

interface TestTitleInputProps {
    title: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    isLoading: boolean;
}

export const TestTitleInput: React.FC<TestTitleInputProps> = ({ title, onChange, error, isLoading }) => {
    return (
        <>
            {isLoading ? (
                <Typography component="div" key={'h3'} variant={'h3'}>
                    <Skeleton />
                </Typography>
            ) : (
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
            )}
        </>
    );
};
